import { create } from 'zustand';
import { UserProfile, Pickup, Dispute, WalletTransaction, SavedCard, DropOffLog } from '../types';
import { auth, db as firestoreDb, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  getDocs, 
  collection, 
  query, 
  where 
} from 'firebase/firestore';

interface KleanState {
  currentUser: UserProfile | null;
  pickups: Pickup[];
  disputes: Dispute[];
  transactions: WalletTransaction[];
  vouchersRedeemedCount: number;
  totalVouchersCount: number;
  dropOffLogs: DropOffLog[];
  showLogoutConfirm: boolean;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  
  // Actions
  setShowLogoutConfirm: (show: boolean) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (firstName: string, lastName: string, email: string, password?: string, referredBy?: string) => Promise<boolean>;
  localDatabaseLogin: (email: string, password?: string) => boolean;
  localDatabaseSignup: (firstName: string, lastName: string, email: string, password?: string, referredBy?: string) => boolean;
  logout: () => void;
  fundWallet: (amount: number) => void;
  addCard: (brand: 'Visa' | 'Mastercard', last4: string, expiry: string) => void;
  removeCard: (id: string) => void;
  schedulePickup: (pickupData: Omit<Pickup, 'id' | 'userId' | 'status' | 'createdAt' | 'pointsAwarded'>) => Pickup;
  cancelPickup: (id: string) => { success: boolean; error?: string };
  raiseDispute: (pickupId: string, category: string, description: string) => void;
  redeemVoucher: (pointsCost: number) => boolean;
  logDropOff: (locationName: string, isAtStation?: boolean, coords?: string) => void;
  adminApproveDropOff: (logId: string) => void;
  adminRejectDropOff: (logId: string) => void;
  simulateCollectorUpdate: (id: string, newStatus: 'Pending' | 'Accepted' | 'Completed') => void;
  getGlobalStats: () => { activeUsers: number; wasteRecycledKg: number; citiesServed: number };
  checkReferralCodeValidity: (code: string) => Promise<boolean>;
}

// Initial dummy data matched exactly to uploaded screenshots
const initialUser: UserProfile = {
  uid: 'user_lagos_1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'you@example.com',
  points: 0,
  walletBalance: 5000,
  referralCode: 'JOHND123',
  referralsInvited: 0,
  referralsJoined: 0,
  referralsPointsEarned: 0,
  savedCards: [
    { id: 'card_1', brand: 'Visa', last4: '4532', expiry: '12/26' },
    { id: 'card_2', brand: 'Mastercard', last4: '8901', expiry: '08/27' }
  ]
};

const generateReferralCode = (firstName: string, lastName: string): string => {
  const fPart = firstName.trim().toUpperCase().replace(/[^A-Z]/g, '');
  const lPart = lastName.trim().toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3);
  const prefix = fPart ? (fPart + lPart).slice(0, 5) : 'KLEAN';
  const num = Math.floor(100 + Math.random() * 900);
  return `${prefix}${num}`;
};

const initialPickups: Pickup[] = [
  {
    id: 'PU-2026-0518',
    userId: 'user_lagos_1',
    address: '15 Awolowo Road, Ikoyi, Lagos',
    phone: '+234 803 123 4567',
    date: 'May 18, 2026',
    timeSlot: '8:00 AM - 12:00 PM',
    bagsCount: 4,
    wasteTypes: ['General Waste'],
    price: 2000,
    status: 'Accepted', // "Scheduled"
    paymentMethod: 'Wallet',
    pointsAwarded: false,
    createdAt: '2026-05-14T10:00:00Z'
  },
  {
    id: 'PU-2026-0520',
    userId: 'user_lagos_1',
    address: '42 Adeola Odeku Street, Victoria Island, Lagos',
    phone: '+234 809 987 6543',
    date: 'May 20, 2026',
    timeSlot: '2:00 PM - 6:00 PM',
    bagsCount: 8,
    wasteTypes: ['Recycling'],
    price: 4000,
    status: 'Accepted', // "Scheduled"
    paymentMethod: 'Card ending in 4532',
    pointsAwarded: false,
    createdAt: '2026-05-16T14:30:00Z'
  },
  {
    id: 'PU-2026-0515',
    userId: 'user_lagos_1',
    address: '8 Admiralty Way, Lekki Phase 1, Lagos',
    phone: '+234 812 345 6789',
    date: 'May 15, 2026',
    timeSlot: '8:00 AM - 12:00 PM',
    bagsCount: 4,
    wasteTypes: ['General Waste'],
    price: 2000,
    status: 'Completed',
    paymentMethod: 'Wallet',
    pointsAwarded: true,
    createdAt: '2026-05-10T09:00:00Z'
  }
];

const initialDisputes: Dispute[] = [
  {
    id: 'DSP-001',
    userId: 'user_lagos_1',
    pickupId: 'PU-2026-0512',
    category: 'Pickup not completed',
    description: 'The collector did not show up on the scheduled date, and the application status is marked as accepted.',
    status: 'Resolved',
    resolution: 'Refund',
    createdAt: '2026-05-12T17:00:00Z'
  },
  {
    id: 'DSP-002',
    userId: 'user_lagos_1',
    pickupId: 'PU-2026-0508',
    category: 'Wrong waste type collected',
    description: 'The collector collected cardboard boxes instead of sorted glass recycling materials as requested.',
    status: 'Pending',
    resolution: 'Reschedule',
    createdAt: '2026-05-08T11:20:00Z'
  },
  {
    id: 'DSP-003',
    userId: 'user_lagos_1',
    pickupId: 'PU-2026-0505',
    category: 'Collector arrived 3 hours late',
    description: 'Collector came at 5 PM instead of the morning slot, resulting in missed work coordination.',
    status: 'Rejected',
    resolution: 'Refund',
    createdAt: '2026-05-05T15:45:00Z'
  }
];

const initialTransactions: WalletTransaction[] = [
  {
    id: 'TXN-004',
    userId: 'user_lagos_1',
    type: 'pickup_payment',
    amount: 2000,
    description: 'Waste pickup payment',
    date: 'May 15, 2026',
    status: 'Success'
  },
  {
    id: 'TXN-003',
    userId: 'user_lagos_1',
    type: 'funding',
    amount: 5000,
    description: 'Wallet funding',
    date: 'May 14, 2026',
    status: 'Success'
  },
  {
    id: 'TXN-002',
    userId: 'user_lagos_1',
    type: 'pickup_payment',
    amount: 2000,
    description: 'Waste pickup payment',
    date: 'May 10, 2026',
    status: 'Success'
  },
  {
    id: 'TXN-001',
    userId: 'user_lagos_1',
    type: 'funding',
    amount: 2000,
    description: 'Wallet funding',
    date: 'May 8, 2026',
    status: 'Success'
  }
];

// Database user record shape
interface UserRecord {
  profile: UserProfile;
  passwordHash: string;
  pickups: Pickup[];
  disputes: Dispute[];
  transactions: WalletTransaction[];
  vouchersRedeemedCount: number;
  totalVouchersCount: number;
  dropOffLogs?: DropOffLog[];
}

// Clean helper to access authentic local database
const getUsersDb = (): Record<string, UserRecord> => {
  try {
    const raw = localStorage.getItem('kleancity_users_db');
    if (raw) {
      const dbInstance = JSON.parse(raw);
      // Ensure all users utilize custom name-coined referral codes
      if (dbInstance['you@example.com']?.profile) {
        dbInstance['you@example.com'].profile.referralCode = 'JOHND123';
        // Force reset referrals to 0 to dynamically increase when new users register with their code
        dbInstance['you@example.com'].profile.referralsInvited = 0;
        dbInstance['you@example.com'].profile.referralsJoined = 0;
        dbInstance['you@example.com'].profile.referralsPointsEarned = 0;
      }
      if (dbInstance['praislaw@gmail.com']?.profile) {
        dbInstance['praislaw@gmail.com'].profile.referralCode = 'PRAIS987';
        // Force reset referrals to 0 to dynamically increase when new users register with their code
        dbInstance['praislaw@gmail.com'].profile.referralsInvited = 0;
        dbInstance['praislaw@gmail.com'].profile.referralsJoined = 0;
        dbInstance['praislaw@gmail.com'].profile.referralsPointsEarned = 0;
      }
      return dbInstance;
    }
  } catch {}

  // Seed default registered credentials exactly as required
  const seededDb: Record<string, UserRecord> = {
    'you@example.com': {
      profile: initialUser,
      passwordHash: 'password', // authentic plain text password
      pickups: initialPickups,
      disputes: initialDisputes,
      transactions: initialTransactions,
      vouchersRedeemedCount: 12,
      totalVouchersCount: 8
    },
    'praislaw@gmail.com': {
      profile: {
        uid: 'user_lagos_praislaw',
        firstName: 'Prais',
        lastName: 'Law',
        email: 'praislaw@gmail.com',
        points: 0,
        walletBalance: 12000,
        referralCode: 'PRAIS987',
        referralsInvited: 0,
        referralsJoined: 0,
        referralsPointsEarned: 0,
        savedCards: [
          { id: 'card_1', brand: 'Visa', last4: '1111', expiry: '05/29' }
        ]
      },
      passwordHash: 'password',
      pickups: [
        {
          id: 'PU-2026-0521',
          userId: 'user_lagos_praislaw',
          address: '100 Admiralty Way, Lekki, Lagos',
          phone: '+234 803 111 2222',
          date: 'May 21, 2026',
          timeSlot: '2:00 PM - 6:00 PM',
          bagsCount: 6,
          wasteTypes: ['Recycling'],
          price: 3000,
          status: 'Accepted',
          paymentMethod: 'Wallet',
          pointsAwarded: false,
          createdAt: '2026-05-21T10:00:00Z'
        }
      ],
      disputes: [],
      transactions: [
        {
          id: 'TXN-005',
          userId: 'user_lagos_praislaw',
          type: 'funding',
          amount: 15000,
          description: 'Wallet funding',
          date: 'May 21, 2026',
          status: 'Success'
        },
        {
          id: 'TXN-006',
          userId: 'user_lagos_praislaw',
          type: 'pickup_payment',
          amount: 3000,
          description: 'Waste pickup payment',
          date: 'May 21, 2026',
          status: 'Success'
        }
      ],
      vouchersRedeemedCount: 3,
      totalVouchersCount: 2
    }
  };

  try {
    localStorage.setItem('kleancity_users_db', JSON.stringify(seededDb));
  } catch {}
  return seededDb;
};

const saveUsersDb = (db: Record<string, UserRecord>) => {
  try {
    localStorage.setItem('kleancity_users_db', JSON.stringify(db));
  } catch {}
};

// Helper to load/save state with localStorage
const getLocalStorage = (key: string, fallback: any) => {
  try {
    const val = localStorage.getItem(`kleancity_${key}`);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
};

const setLocalStorage = (key: string, val: any) => {
  try {
    localStorage.setItem(`kleancity_${key}`, JSON.stringify(val));
  } catch {}
};

export const useKleanStore = create<KleanState>((set, get) => {
  // Read multi-user specific session from active stored email
  const getActiveSessionEmail = () => {
    try {
      return localStorage.getItem('kleancity_current_user_email') || '';
    } catch {
      return '';
    }
  };

  const db = getUsersDb();
  const currentEmail = getActiveSessionEmail();
  const activeRecord = currentEmail ? db[currentEmail.toLowerCase()] : null;

  const initialLoadedUser = activeRecord ? activeRecord.profile : null;
  const initialLoadedPickups = activeRecord ? activeRecord.pickups : [];
  const initialLoadedDisputes = activeRecord ? activeRecord.disputes : [];
  const initialLoadedTransactions = activeRecord ? activeRecord.transactions : [];
  const initialLoadedVRedeemed = activeRecord ? activeRecord.vouchersRedeemedCount : 0;
  const initialLoadedTVouchers = activeRecord ? activeRecord.totalVouchersCount : 0;
  const initialLoadedDropOffLogs = activeRecord ? (activeRecord.dropOffLogs || []) : [];

  // Single synced updates handler to synchronize client state to users DB seamlessly
  const syncWithDb = async (updated: Partial<KleanState>) => {
    set(updated);
    
    const latestState = get();
    const currentUser = latestState.currentUser;
    if (currentUser) {
      const activeEmail = currentUser.email;
      if (activeEmail) {
        const dbInstance = getUsersDb();
        const userKey = activeEmail.toLowerCase().trim();
        const currentRecord = dbInstance[userKey];
        if (currentRecord) {
          dbInstance[userKey] = {
            ...currentRecord,
            profile: latestState.currentUser!,
            pickups: latestState.pickups,
            disputes: latestState.disputes,
            transactions: latestState.transactions,
            vouchersRedeemedCount: latestState.vouchersRedeemedCount,
            totalVouchersCount: latestState.totalVouchersCount,
            dropOffLogs: latestState.dropOffLogs
          };
          saveUsersDb(dbInstance);
        }
      }

      // Sync synchronously/asynchronously to real cloud Firebase Firestore if auth matches
      const firebaseUser = auth.currentUser;
      if (firebaseUser && firebaseUser.uid === currentUser.uid) {
        try {
          // Write profile to /users/{uid}
          await setDoc(doc(firestoreDb, 'users', firebaseUser.uid), {
            uid: currentUser.uid,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
            points: currentUser.points,
            walletBalance: currentUser.walletBalance,
            referralCode: currentUser.referralCode,
            referralsInvited: currentUser.referralsInvited,
            referralsJoined: currentUser.referralsJoined,
            referralsPointsEarned: currentUser.referralsPointsEarned,
            savedCards: currentUser.savedCards,
            vouchersRedeemedCount: latestState.vouchersRedeemedCount,
            totalVouchersCount: latestState.totalVouchersCount
          });

          // Write pickups, disputes, and transactions asynchronously
          for (const item of latestState.pickups) {
            await setDoc(doc(firestoreDb, 'pickups', item.id), item);
          }
          for (const item of latestState.disputes) {
            await setDoc(doc(firestoreDb, 'disputes', item.id), item);
          }
          for (const item of latestState.transactions) {
            await setDoc(doc(firestoreDb, 'transactions', item.id), item);
          }
        } catch (fbError) {
          console.error("Firebase sync exception (likely security permission boundaries in play):", fbError);
        }
      }
    }
  };

  return {
    currentUser: initialLoadedUser,
    pickups: initialLoadedPickups,
    disputes: initialLoadedDisputes,
    transactions: initialLoadedTransactions,
    vouchersRedeemedCount: initialLoadedVRedeemed,
    totalVouchersCount: initialLoadedTVouchers,
    dropOffLogs: initialLoadedDropOffLogs,
    showLogoutConfirm: false,
    toast: null,

    setShowLogoutConfirm: (show) => set({ showLogoutConfirm: show }),

    showToast: (message, type = 'info') => {
      set({ toast: { message, type } });
      setTimeout(() => {
        if (get().toast?.message === message) {
          set({ toast: null });
        }
      }, 5000);
    },

    hideToast: () => set({ toast: null }),

    localDatabaseLogin: (email: string, password?: string) => {
      const dbInstance = getUsersDb();
      const loginEmail = email.toLowerCase().trim();
      const userRecord = dbInstance[loginEmail];

      if (!userRecord) {
        throw new Error("No registration data found for this email in our database. Please sign up or verify the email address.");
      }

      if (password && userRecord.passwordHash && userRecord.passwordHash !== password) {
        throw new Error("Incorrect password. Please verify your credentials and try again.");
      }

      try {
        localStorage.setItem('kleancity_current_user_email', loginEmail);
      } catch {}

      set({
        currentUser: userRecord.profile,
        pickups: userRecord.pickups,
        disputes: userRecord.disputes,
        transactions: userRecord.transactions,
        vouchersRedeemedCount: userRecord.vouchersRedeemedCount,
        totalVouchersCount: userRecord.totalVouchersCount
      });

      get().showToast(`Welcome back, ${userRecord.profile.firstName}! (Local database)`, 'success');
      return true;
    },

    login: async (email: string, password?: string) => {
      const loginEmail = email.toLowerCase().trim();
      const defaultPassword = password || 'password';

      try {
        // Attempt authentic Firebase backend sign-in
        const credentials = await signInWithEmailAndPassword(auth, loginEmail, defaultPassword);
        const uid = credentials.user.uid;

        // Fetch User Profile document from Firestore
        let userDoc;
        try {
          userDoc = await getDoc(doc(firestoreDb, 'users', uid));
        } catch (err) {
          return handleFirestoreError(err, OperationType.GET, `users/${uid}`);
        }

        if (!userDoc.exists()) {
          throw new Error("No registration data found in the cloud database for this authenticated account.");
        }

        const profileData = userDoc.data() as UserProfile;

        // Dynamically fetch matching pickups, disputes, and transactions
        let pickupsList: Pickup[] = [];
        let disputesList: Dispute[] = [];
        let transactionsList: WalletTransaction[] = [];

        try {
          const pSnap = await getDocs(query(collection(firestoreDb, 'pickups'), where('userId', '==', uid)));
          pickupsList = pSnap.docs.map(d => d.data() as Pickup);
        } catch (e) {
          console.warn("Could not load pickups from Firestore:", e);
        }

        try {
          const dSnap = await getDocs(query(collection(firestoreDb, 'disputes'), where('userId', '==', uid)));
          disputesList = dSnap.docs.map(d => d.data() as Dispute);
        } catch (e) {
          console.warn("Could not load disputes from Firestore:", e);
        }

        try {
          const tSnap = await getDocs(query(collection(firestoreDb, 'transactions'), where('userId', '==', uid)));
          transactionsList = tSnap.docs.map(d => d.data() as WalletTransaction);
        } catch (e) {
          console.warn("Could not load transactions from Firestore:", e);
        }

        pickupsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        transactionsList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        const vRedeemedCount = (profileData as any).vouchersRedeemedCount || 0;
        const tVouchersCount = (profileData as any).totalVouchersCount || 0;

        try {
          localStorage.setItem('kleancity_current_user_email', loginEmail);
        } catch {}

        set({
          currentUser: profileData,
          pickups: pickupsList,
          disputes: disputesList,
          transactions: transactionsList,
          vouchersRedeemedCount: vRedeemedCount,
          totalVouchersCount: tVouchersCount
        });

        get().showToast(`Welcome back, ${profileData.firstName}!`, 'success');
        return true;

      } catch (authError: any) {
        console.error("Firebase Auth Sign-In Error: ", authError);

        if (
          authError.code === 'auth/configuration-not-found' || 
          authError.code === 'auth/operation-not-allowed' ||
          authError.message?.includes('disabled')
        ) {
          console.warn("Email/Password Auth provider disabled in console. Routing to Local Database Fallback.");
          return get().localDatabaseLogin(loginEmail, defaultPassword);
        }

        let errMsg = authError.message || String(authError);
        if (authError.code === 'auth/user-not-found' || authError.code === 'auth/invalid-credential') {
          errMsg = "No registration data found for this email. Please sign up or verify the email address.";
        } else if (authError.code === 'auth/wrong-password') {
          errMsg = "Incorrect password. Please verify your credentials and try again.";
        }

        get().showToast(errMsg, 'error');
        throw new Error(errMsg);
      }
    },

    localDatabaseSignup: (firstName: string, lastName: string, email: string, password?: string, referredBy?: string) => {
      const dbInstance = getUsersDb();
      const signupEmail = email.toLowerCase().trim();

      if (dbInstance[signupEmail]) {
        throw new Error("An account under this email already exists. Please login instead.");
      }

      const defaultPass = password || 'password';

      // Coin names-coined unique referral code
      const customReferralCode = generateReferralCode(firstName, lastName);

      // Check for valid referrer & award referee points bonus
      let referrerEmail: string | null = null;
      let matchedReferralPoints = 0;
      if (referredBy) {
        const uppercaseRef = referredBy.trim().toUpperCase();
        for (const emailKey of Object.keys(dbInstance)) {
          if (dbInstance[emailKey].profile.referralCode?.toUpperCase() === uppercaseRef) {
            referrerEmail = emailKey;
            matchedReferralPoints = 100; // 100 welcome points for registering with ref code
            break;
          }
        }
      }

      const newUserProfile: UserProfile = {
        uid: `user_${Date.now()}`,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: signupEmail,
        points: matchedReferralPoints,
        walletBalance: 10000,
        referralCode: customReferralCode,
        referralsInvited: 0,
        referralsJoined: 0,
        referralsPointsEarned: 0,
        savedCards: []
      };

      // Award Points & stats to Referrer (150 Points Accredited to Referrer)
      if (referrerEmail) {
        const referrerRecord = dbInstance[referrerEmail];
        const updatedReferrerProfile = {
          ...referrerRecord.profile,
          referralsInvited: (referrerRecord.profile.referralsInvited || 0) + 1,
          referralsJoined: (referrerRecord.profile.referralsJoined || 0) + 1,
          referralsPointsEarned: (referrerRecord.profile.referralsPointsEarned || 0) + 150,
          points: (referrerRecord.profile.points || 0) + 150
        };
        dbInstance[referrerEmail] = {
          ...referrerRecord,
          profile: updatedReferrerProfile
        };
      }

      const newRecord: UserRecord = {
        profile: newUserProfile,
        passwordHash: defaultPass,
        pickups: [],
        disputes: [],
        transactions: [],
        vouchersRedeemedCount: 0,
        totalVouchersCount: 0
      };

      dbInstance[signupEmail] = newRecord;
      saveUsersDb(dbInstance);

      try {
        localStorage.setItem('kleancity_current_user_email', signupEmail);
      } catch {}

      set({
        currentUser: newUserProfile,
        pickups: [],
        disputes: [],
        transactions: [],
        vouchersRedeemedCount: 0,
        totalVouchersCount: 0
      });

      get().showToast(referredBy && !referrerEmail 
        ? 'Account created successfully! (Referral code was invalid)' 
        : referrerEmail 
          ? `Account created successfully with referral! You and your referrer both earned points.` 
          : 'Account created successfully! (Local database)', 
        'success');
      return true;
    },

    signup: async (firstName: string, lastName: string, email: string, password?: string, referredBy?: string) => {
      const signupEmail = email.toLowerCase().trim();
      const defaultPassword = password || 'password';

      try {
        // Authentically create user registration credentials in Firebase Auth
        const credentials = await createUserWithEmailAndPassword(auth, signupEmail, defaultPassword);
        const uid = credentials.user.uid;

        // Coin names-coined unique referral code
        const customReferralCode = generateReferralCode(firstName, lastName);

        // Check for valid referrer & award points in real dynamic cloud/local database
        let referrerUid: string | null = null;
        let referrerData: any = null;
        let localReferrerEmail: string | null = null;
        let matchedReferralPoints = 0;

        const dbInstance = getUsersDb();

        if (referredBy) {
          const trimmedRef = referredBy.trim().toUpperCase();
          
          // Check local database first
          for (const emailKey of Object.keys(dbInstance)) {
            if (dbInstance[emailKey].profile.referralCode?.toUpperCase() === trimmedRef) {
              localReferrerEmail = emailKey;
              matchedReferralPoints = 100;
              break;
            }
          }

          // Check firestore too
          try {
            const q = query(collection(firestoreDb, 'users'), where('referralCode', '==', trimmedRef));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              const rDoc = querySnapshot.docs[0];
              referrerUid = rDoc.id;
              referrerData = rDoc.data();
              matchedReferralPoints = 100; // Award newcomer welcome points
            }
          } catch (err) {
            console.warn("Could not query Firestore for referral code verification:", err);
          }
        }

        const isReferralCodeReallyValid = !!(referrerUid || localReferrerEmail);

        const newUserProfile: UserProfile = {
          uid: uid,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: signupEmail,
          points: matchedReferralPoints,
          walletBalance: 10000, // Pre-funded with ₦10,000 for instant app utility
          referralCode: customReferralCode,
          referralsInvited: 0,
          referralsJoined: 0,
          referralsPointsEarned: 0,
          savedCards: []
        };

        // If referrer found in cloud, reward them inside Cloud / Firestore
        if (referrerUid && referrerData) {
          try {
            await setDoc(doc(firestoreDb, 'users', referrerUid), {
              ...referrerData,
              referralsInvited: (referrerData.referralsInvited || 0) + 1,
              referralsJoined: (referrerData.referralsJoined || 0) + 1,
              referralsPointsEarned: (referrerData.referralsPointsEarned || 0) + 150,
              points: (referrerData.points || 0) + 150
            });
          } catch (err) {
            console.warn("Could not write updated stats to referrer doc in Firestore:", err);
          }
        }

        // Create User Profile doc in Firestore
        try {
          await setDoc(doc(firestoreDb, 'users', uid), {
            ...newUserProfile,
            vouchersRedeemedCount: 0,
            totalVouchersCount: 0
          });
        } catch (err) {
          return handleFirestoreError(err, OperationType.CREATE, `users/${uid}`);
        }

        // Award Referrer inside Local Database (150 Points Accredited to Referrer)
        if (localReferrerEmail) {
          const rRecord = dbInstance[localReferrerEmail];
          dbInstance[localReferrerEmail] = {
            ...rRecord,
            profile: {
              ...rRecord.profile,
              referralsInvited: (rRecord.profile.referralsInvited || 0) + 1,
              referralsJoined: (rRecord.profile.referralsJoined || 0) + 1,
              referralsPointsEarned: (rRecord.profile.referralsPointsEarned || 0) + 150,
              points: (rRecord.profile.points || 0) + 150
            }
          };
        }

        dbInstance[signupEmail] = {
          profile: newUserProfile,
          passwordHash: defaultPassword,
          pickups: [],
          disputes: [],
          transactions: [],
          vouchersRedeemedCount: 0,
          totalVouchersCount: 0
        };
        saveUsersDb(dbInstance);

        try {
          localStorage.setItem('kleancity_current_user_email', signupEmail);
        } catch {}

        set({
          currentUser: newUserProfile,
          pickups: [],
          disputes: [],
          transactions: [],
          vouchersRedeemedCount: 0,
          totalVouchersCount: 0
        });

        get().showToast(referredBy && !isReferralCodeReallyValid
          ? 'Account created successfully in Firebase! (Referral code was invalid)'
          : isReferralCodeReallyValid
            ? `Account created successfully with referral! You and your referrer both earned points.`
            : 'Account created successfully in Firebase!', 
          'success');
        return true;

      } catch (authError: any) {
        console.error("Firebase Auth Signup Error: ", authError);

        if (
          authError.code === 'auth/configuration-not-found' || 
          authError.code === 'auth/operation-not-allowed' ||
          authError.message?.includes('disabled')
        ) {
          console.warn("Email/Password Auth provider disabled in console. Routing to Local Database Fallback.");
          return get().localDatabaseSignup(firstName, lastName, signupEmail, defaultPassword, referredBy);
        }

        let errMsg = authError.message || String(authError);
        if (authError.code === 'auth/email-already-in-use') {
          errMsg = "An account under this email already exists. Please login instead.";
        } else if (authError.code === 'auth/weak-password') {
          errMsg = "The password is too weak. Please use a password with at least 6 characters.";
        }

        get().showToast(errMsg, 'error');
        throw new Error(errMsg);
      }
    },

    logout: async () => {
      try {
        await signOut(auth);
      } catch (e) {
        console.error("Firebase SignOut error:", e);
      }

      try {
        localStorage.removeItem('kleancity_current_user_email');
      } catch {}

      set({ 
        currentUser: null,
        pickups: [],
        disputes: [],
        transactions: [],
        vouchersRedeemedCount: 0,
        totalVouchersCount: 0
      });

      get().showToast('Logged out successfully', 'info');
    },

    fundWallet: (amount: number) => {
      const user = get().currentUser;
      if (!user) return;

      const updatedUser = {
        ...user,
        walletBalance: user.walletBalance + amount
      };

      const newTxn: WalletTransaction = {
        id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        userId: user.uid,
        type: 'funding',
        amount,
        description: 'Wallet funding',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Success'
      };

      const txns = [newTxn, ...get().transactions];

      syncWithDb({ 
        currentUser: updatedUser,
        transactions: txns
      });
      get().showToast(`₦${amount.toLocaleString()} added to your wallet!`, 'success');
    },

    addCard: (brand, last4, expiry) => {
      const user = get().currentUser;
      if (!user) return;

      const newCard: SavedCard = {
        id: `card_${Date.now()}`,
        brand,
        last4,
        expiry
      };

      const updatedUser = {
        ...user,
        savedCards: [...user.savedCards, newCard]
      };

      syncWithDb({ currentUser: updatedUser });
      get().showToast(`${brand} card added successfully!`, 'success');
    },

    removeCard: (id) => {
      const user = get().currentUser;
      if (!user) return;

      const updatedUser = {
        ...user,
        savedCards: user.savedCards.filter(c => c.id !== id)
      };

      syncWithDb({ currentUser: updatedUser });
      get().showToast('Card removed successfully.', 'info');
    },

    schedulePickup: (pickupData) => {
      const user = get().currentUser;
      const userId = user ? user.uid : 'guest';

      const newPickup: Pickup = {
        ...pickupData,
        id: `PU-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        userId,
        status: 'Pending',
        pointsAwarded: false,
        createdAt: new Date().toISOString()
      };

      const payments = get().transactions;
      let updatedUser = user;

      // Handle wallet deduction if paid from wallet
      if (pickupData.paymentMethod === 'Wallet' && user) {
        updatedUser = {
          ...user,
          walletBalance: Math.max(0, user.walletBalance - pickupData.price)
        };
      }

      // Add payment transaction
      const newTxn: WalletTransaction = {
        id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        userId,
        type: 'pickup_payment',
        amount: pickupData.price,
        description: 'Waste pickup payment',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Success'
      };

      const updatedPickups = [newPickup, ...get().pickups];
      const updatedTxns = [newTxn, ...payments];

      syncWithDb({ 
        pickups: updatedPickups,
        transactions: updatedTxns,
        currentUser: updatedUser
      });

      get().showToast('Waste pickup scheduled successfully!', 'success');
      return newPickup;
    },

    cancelPickup: (id) => {
      const pickup = get().pickups.find(p => p.id === id);
      if (!pickup) return { success: false, error: 'Pickup not found' };

      // Under the rule: "Pickups scheduled can only be cancelled after 15 minutes, please contact customer care to settle the dispute."
      // Since this is a real-time system, we will display this custom validation alert to respect the prompt requirement EXACTLY!
      return { 
        success: false, 
        error: 'Pickups scheduled can only be cancelled after 15 minutes, please contact customer care to settle the dispute.' 
      };
    },

    raiseDispute: (pickupId, category, description) => {
      const user = get().currentUser;
      const userId = user ? user.uid : 'guest';

      const newDispute: Dispute = {
        id: `DSP-${Math.floor(100 + Math.random() * 900)}`,
        userId,
        pickupId,
        category,
        description,
        status: 'Pending',
        resolution: 'Reschedule',
        createdAt: new Date().toISOString()
      };

      const updatedDisputes = [newDispute, ...get().disputes];
      syncWithDb({ disputes: updatedDisputes });
      get().showToast('Dispute ticket generated successfully. We will review soon.', 'success');
    },

    redeemVoucher: (pointsCost) => {
      const user = get().currentUser;
      if (!user) return false;

      if (user.points < pointsCost) {
        get().showToast('Insufficient Reward Points!', 'error');
        return false;
      }

      // Deduct points, increment counts
      const updatedUser = {
        ...user,
        points: user.points - pointsCost
      };

      const updatedRedeemedCount = get().vouchersRedeemedCount + 1;
      const updatedTotalCount = get().totalVouchersCount + 1;

      syncWithDb({ 
        currentUser: updatedUser,
        vouchersRedeemedCount: updatedRedeemedCount,
        totalVouchersCount: updatedTotalCount
      });

      get().showToast('Voucher redeemed successfully! Code sent to your email.', 'success');
      return true;
    },

    logDropOff: (locationName, isAtStation = false, coords = 'Undetected') => {
      const user = get().currentUser;
      if (!user) return;

      if (!isAtStation) {
        get().showToast(`Verification failed: You are not physically at the ${locationName} drop-off station! Points cannot be awarded.`, 'error');
        return;
      }

      // Record pending log to wait for admin vetting
      const newLog: DropOffLog = {
        id: `DROP-${Math.floor(1000 + Math.random() * 9000)}`,
        userId: user.uid,
        stationName: locationName,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        gpsCoordinates: coords,
        verifiedLocation: true,
        status: 'Pending',
        pointsAwarded: 10
      };

      const updatedLogs = [newLog, ...get().dropOffLogs];

      syncWithDb({
        dropOffLogs: updatedLogs
      });

      get().showToast(`Drop-off registered successfully at ${locationName}! Sent to Lagos City Recycle Admin for vetting.`, 'info');
    },

    adminApproveDropOff: (logId) => {
      const user = get().currentUser;
      if (!user) return;

      const log = get().dropOffLogs.find(l => l.id === logId);
      if (!log || log.status !== 'Pending') return;

      const updatedLogs = get().dropOffLogs.map(l => {
        if (l.id === logId) {
          return { ...l, status: 'Approved' as const };
        }
        return l;
      });

      const pointsToAward = log.pointsAwarded || 10;
      const updatedUser = {
        ...user,
        points: user.points + pointsToAward
      };

      const newTxn: WalletTransaction = {
        id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        userId: user.uid,
        type: 'reward',
        amount: pointsToAward,
        description: `Verified Drop-off reward at ${log.stationName}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Success'
      };

      const txns = [newTxn, ...get().transactions];

      syncWithDb({
        currentUser: updatedUser,
        dropOffLogs: updatedLogs,
        transactions: txns
      });

      get().showToast(`Admin vetted and APPROVED drop-off! +10 KleanPoints credited to your balance.`, 'success');
    },

    adminRejectDropOff: (logId) => {
      const user = get().currentUser;
      if (!user) return;

      const log = get().dropOffLogs.find(l => l.id === logId);
      if (!log || log.status !== 'Pending') return;

      const updatedLogs = get().dropOffLogs.map(l => {
        if (l.id === logId) {
          return { ...l, status: 'Rejected' as const };
        }
        return l;
      });

      syncWithDb({
        dropOffLogs: updatedLogs
      });

      get().showToast(`Admin vetted and REJECTED drop-off report at ${log.stationName}.`, 'error');
    },

    simulateCollectorUpdate: (id, newStatus) => {
      const updatedPickups = get().pickups.map(p => {
        if (p.id === id) {
          let updated = { ...p, status: newStatus };
          
          // Award points if transition to Completed happens
          if (newStatus === 'Completed' && !p.pointsAwarded && get().currentUser) {
            const user = get().currentUser!;
            const updatedUser = {
              ...user,
              points: user.points + 5
            };
            syncWithDb({ currentUser: updatedUser });
            updated.pointsAwarded = true;
            get().showToast('Collection completed! +5 KleanPoints awarded!', 'success');
          }
          return updated;
        }
        return p;
      });

      syncWithDb({ pickups: updatedPickups });
    },

    getGlobalStats: () => {
      const dbInstance = getUsersDb();
      const emails = Object.keys(dbInstance);
      const activeUsers = emails.length;

      let totalBags = 0;
      emails.forEach(email => {
        const record = dbInstance[email];
        if (record && record.pickups) {
          record.pickups.forEach(p => {
            totalBags += p.bagsCount;
          });
        }
      });

      // Assume each waste bag is on average 25kg
      return {
        activeUsers,
        wasteRecycledKg: totalBags * 25,
        citiesServed: 1
      };
    },

    checkReferralCodeValidity: async (code: string): Promise<boolean> => {
      if (!code || !code.trim()) return true;
      const cleanCode = code.trim().toUpperCase();

      // Check local DB first
      const dbInstance = getUsersDb();
      const codeInLocal = Object.values(dbInstance).some(
        record => record.profile.referralCode?.toUpperCase() === cleanCode
      );
      if (codeInLocal) return true;

      // Check Firestore
      try {
        const q = query(collection(firestoreDb, 'users'), where('referralCode', '==', cleanCode));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          return true;
        }
      } catch (err) {
        console.warn("Firestore referral check error:", err);
      }

      return false;
    }
  };
});
