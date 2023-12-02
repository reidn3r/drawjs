const UserOutput = require('../models/useroutput');

const createUserOutput = async(user_id, sketch_id, probability) => {
    /* Serviço usado apenas para criar dado caso não exista. Se exitir, nada deve acontecer. */
    await UserOutput.create({
        user_id: user_id,
        sketch_id: sketch_id,
        probability: probability,
        createdAt: new Date(),
        updatedAt: new Date(),
    })
}

module.exports = createUserOutput;