const SketchInfo = require('../models/sketchinfo');

const findOrCreateSketch = async(id, label) => {
    await SketchInfo.findOrCreate({
        where:{ id: id },
        defaults:{
            label: label,
        }
    });
}

module.exports = findOrCreateSketch;