const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const schema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'title cannot be empty']
    },
    status: {
        type: String,
        enum: ['active', 'nonactive'],
        default: 'active'
    },
    softDelete: {
        type: Date,
        default: null
    }
},
{
    timestamps: true
})

schema.plugin(mongoosePaginate)

const schemaModel = mongoose.model('Country', schema)
schemaModel.paginate().then({})
module.exports = schemaModel