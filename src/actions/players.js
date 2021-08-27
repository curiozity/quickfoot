import { db } from "../firebase/firebase-config";


export const startNewPlayer = () => {
    return async( dispatch, getState ) => {
        const state = getState();
        const newPlayer = {
            nombre: 'Ernesto',
            demarcacion: 'Central'
        }

        const docRef = await db.collection('players').add( newPlayer );
    }
}

export const startListPlayers = () => {

    const players = [];

    const players2 = [
        {
            id: 1,
            nombre: 'Alberto'
        },
        {
            id: 2,
            nombre: 'Luis'
        }
    ];

    // const playersSnapPromise = new Promise( ( resolve, reject ) => {

    //     const playersSnap = db.collection('players').get();
    //     resolve( playersSnap );

    // });
    
    // playersSnapPromise.then( ( playersSnap ) => {

    //     const players = [];

    //     playersSnap.forEach( ( player ) => {
    //         players.push({
    //             nombre: player.data().nombre,
    //             demarcacion: player.data().demarcacion,
    //         })
    //     //})
    //         //console.log(player.data().nombre)
    //     })
        
    //     return players;
        

    // })

    // players.map((player) => {
    //     console.log('Nombre', player.nombre)
    // })

    const playersArray = db.collection("players").get().then((querySnapshot) => {
        querySnapshot.forEach( doc => {
            // doc.data() is never undefined for query doc snapshots
            players.push({
                ...doc.data()
            })
            console.log(doc.data())
            //console.log(doc.id, " => ", doc.data().nombre);
        });
        // players.map((player) => {
        //     console.log('Nombre', player.nombre)
        // })

        return players;
    
    });
 
    playersArray.map((player) => {
        console.log('Nombre', player.nombre)
    })

    //console.log(players2)

    return playersArray;
    
    //console.log(players);

    // return async( dispatch ) => {
    //     const playersRef = db.collection('players');

    //     playersRef
    //         .onSnapshot( snap => {
    //             snap.forEach( player => {
    //                 console.log(player.data())
    //             });
    //         })
    // }
}