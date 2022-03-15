import {
    findAllTuits, findTuitById, findTuitByUser, createTuit, updateTuit, deleteTuit, deleteTuitsByTuit
} from "../services/tuits-service";
import {createUser, deleteUsersByUsername, findAllUsers, findUserById} from "../services/users-service";

describe('can create tuit with REST API', () => {
    const theTuit = {
        tuit: "create tuit test"
    };

    const adam = {
        username: 'adam_smith', password: 'not0sum', email: 'wealth@nations.com'
    };

    beforeAll(async () => {
        await deleteTuitsByTuit(theTuit.tuit)
        await deleteUsersByUsername(adam.username);
    });

    afterAll(async () => {
        await deleteTuitsByTuit(theTuit.tuit)
        await deleteUsersByUsername(adam.username)
    });

    test('can create new tuit with REST API', async () => {

        //Create new user
        const newUser = await createUser(adam);

        //Create new tuit
        const newTuit = await createTuit(newUser._id, theTuit)

        //Verity new tuit
        expect(newTuit.tuit).toEqual(theTuit.tuit)
        expect(newTuit.postedBy).toEqual(newUser._id)

    });

});

describe('can delete tuit with REST API', () => {
    const theTuit = {
        tuit: "delete tuit test"
    };
    const adam = {
        username: 'adam_smith', password: 'not0sum', email: 'wealth@nations.com'
    };

    beforeAll(async () => {
        await deleteUsersByUsername(adam.username);

    });

    afterAll(async () => {
        await deleteUsersByUsername(adam.username)
    });

    test('can delete new tuit with REST API', async () => {

        //Create new user
        const newUser = await createUser(adam);

        //Create new tuit
        const newTuit = await createTuit(newUser._id, theTuit)

        //Delete tuit status
        const status = await deleteTuit(newTuit._id)

        //Expected tuit status
        expect(status.deletedCount).toBeGreaterThanOrEqual(1);
    });

});

describe('can retrieve a tuit by their primary key with REST API', () => {
    const theTuit = {
        tuit: "retrieve tuit test"
    };
    const adam = {
        username: 'adam_smith', password: 'not0sum', email: 'wealth@nations.com'
    };

    beforeAll(async () => {
        await deleteUsersByUsername(adam.username);
        await deleteTuitsByTuit(theTuit.tuit)
    });

    afterAll(async () => {
        await deleteUsersByUsername(adam.username)
        await deleteTuitsByTuit(theTuit.tuit)
    });

    test('can retrieve new tuit from REST API by primary key', async () => {

        //Create new user
        const newUser = await createUser(adam);

        //Create new tuit
        const newTuit = await createTuit(newUser._id, theTuit)

        //Retrieve the tuit
        const existingTuit = await findTuitById(newTuit._id)

        //Verify tuit parameters
        expect(existingTuit.tuit).toEqual(newTuit.tuit)
        expect(existingTuit._id).toEqual(newTuit._id)
        expect(existingTuit.postedBy._id).toEqual(newUser._id)

    });

});

describe('can retrieve all tuits with REST API', () => {


    const tuits = ["retrieve all tuit test 1", "retrieve all tuit test 2", "retrieve all tuit test 3"];

    const owen = {
        username: 'owen_smith', password: 'not0sum', email: 'wealth@nations.com'
    };

    beforeAll(async () => {
        const newUser = await createUser(owen);

        for(let i =0; i < tuits.length; i++){
            await createTuit(newUser._id, {tuit:tuits[i]})
        }

    });


    afterAll(async () => {
            await deleteUsersByUsername(owen.username)
            for(let i =0; i < tuits.length; i++){
                await deleteTuitsByTuit(tuits[i])
            }
        }
    );

    test('can retrieve all tuits from REST API', async () => {

        //Retrieve all tuits
        const allTuits = await findAllTuits();

        //There should be a minimum number of tuits
        expect(allTuits.length).toBeGreaterThanOrEqual(tuits.length);

        //Checking each tuit we inserted
        const tuitsWeInserted = allTuits.filter(
            tuit => tuits.indexOf(tuit.tuit) >= 0);

        //Compare that each tuit matches the tuits we sent.
        tuitsWeInserted.forEach(tuit => {
            const theTuit = tuits.find(x => x === tuit.tuit);
            expect(tuit.tuit).toEqual(theTuit);

        });
    });
});