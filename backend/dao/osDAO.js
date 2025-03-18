import { initializeApp } from "firebase/app"
import { get, getDatabase, onValue, ref, set, update, remove } from "firebase/database"

export default class osDAO {
    static db
    static async initialize() {
        const firebaseConfig = {
            apiKey: "AIzaSyCllqeU5G-aYwd89qwrMDOE-MZCdzc2frg",
            authDomain: "openschnick-4fb1c.firebaseapp.com",
            projectId: "openschnick-4fb1c",
            storageBucket: "openschnick-4fb1c.firebasestorage.app",
            messagingSenderId: "856978607966",
            appId: "1:856978607966:web:de2c88716255aa83a489cf",
            measurementId: "G-Z1FET9FJSS"
        };

        const initialize = initializeApp(firebaseConfig)
        this.db = getDatabase()
    }

    static async hostLobby(type, rounds, username) {
        try {
            const id = Math.floor(Math.random() * 1000000)
            const reference = ref(this.db, 'lobbys/' + id)

            set(reference, {
                type: type,
                /*rounds: rounds,*/
                /*currentRound: 0,*/
                username: username
            })

            // this.createRound()
            return { status: 'succes', id: id }
        } catch (e) {
            console.error('Unable to createLobby: ' + e)
            return { status: 'failed', error: e }
        }
    }

    static async joinLobby(id, username) {
        try {
            const reference = ref(this.db, 'lobbys/' + id)
            let lobby_exits

            const snapshot = await get(reference)

            if (!snapshot.exists()) {
                return { status: 'notFound' }
            }

            await update(reference, {
                'guestUsername': username
            })

            const lobbySnapshot = await get(reference)
            const lobby = lobbySnapshot.val()


            return { status: 'succes', 'lobby': lobby }
        } catch (e) {
            console.error('Could not join lobby: ' + e)
            return { status: 'failed', error: e }
        }
    }

    static async getLobby(id) {
        const reference = ref(this.db, 'lobbys/' + id)
        const snapshot = await get(reference)
        return snapshot.val()
    }

    // static async addLobbyListener(id) {
    //     try {
    //         const reference = ref()
    //         onValue(reference, (snapshot) => {
    //             const data = snapshot.val()
    //             console.log(data)
    //         })
    //     } catch (e) {
    //         console.error('Unable to add lobby listener')
    //     }
    // }

    // static async getCurrentRound(id) {
    //     try {
    //         const reference = ref(this.db, 'lobbys/' + id + '/currentRound')
    //         get(reference, (snapshot) => {
    //             if (snapshot.exists()) {
    //                 return snapshot.val()
    //             } else {
    //                 console.error('currentRound not found at lobby ' + id)
    //                 return 0
    //             }
    //         })
    //     } catch (e) {
    //         console.error('Unable to get currentRound ')
    //     }
    // }

    // static async createRound(id, number) {
    //     try {
    //         const reference = ref(this.db, 'lobbys/' + id + '/rounds/round' + number)
    //         set(reference, {

    //         })

    //     } catch (e) {
    //         console.error('Unable to add round' + e)
    //     }
    // }

    static async loggedIn(id, user) {
        const reference = ref(this.db, 'lobbys/' + id)

        const snapshot = await get(reference)        
        const exists = snapshot.exists()

        if (!exists) {
            console.log(`Lobby ${id} does not exist`);
            return false
        }

        const lobby = snapshot.val()
        console.log(`Lobby data: ${JSON.stringify(lobby)}`)

        if (lobby[`${user}Word`] && lobby[`${user}Word`].length > 0) {
            console.log(`${user} is logged in with word: ${lobby[`${user}Word`]}`);
            return true
        } else {
            console.log(`${user} is not logged in`);
            return false
        }
    }

    static async bothLoggedIn(id) {
        console.log(`Checking bothLoggedIn for lobby ${id}`);
        const guest = await osDAO.loggedIn(id, 'guest')
        const host = await osDAO.loggedIn(id, 'host')
        console.log('guest ' + guest)
        console.log('host ' + host)
        if (host && guest) {
            return true
        } else { 
            return false 
        }
    }

    static async logInWord(id, word, user) {
        try {
            const isLoggedIn = await osDAO.loggedIn(id, user)
            console.log('li' + isLoggedIn)
            if (isLoggedIn) {
                console.log('already logged in')
                return { status: 'already logged in' }
            }

            const reference = ref(this.db, 'lobbys/' + id)

            await update(reference, {
                [`${user}Word`]: word
            })

            const both = await osDAO.bothLoggedIn(id)
            
            console.log('success' + both)

            return { status: 'succes', both: both }

        } catch (e) {
            console.log('failed ' + e)
            return { status: 'failed', error: e }
        }
    }

    static async closeLobby(id) {
        const reference = ref(this.db, 'lobbys/' + id)

        remove(reference)
            .then(() => {
                console.log("Succesflully deleted " + id)
            })
            .catch(() => {
                console.log("failed to delete " + id)
            })

    }
}