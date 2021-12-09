const Model = require('../models/countryModel')
const sanitize = require('mongo-sanitize')

exports.get = async (request, response, next) => {
    const page = sanitize(request.query.page) ? sanitize(request.query.page) : 1
    const limit = sanitize(request.query.limit) ? sanitize(request.query.limit) : 10
    const search = request.query.search
    const _id = request.query._id

    try{
        if(_id) {
            const getData = await Model.findOne({ $and: [{_id: _id}, {softDelete: null}] })
            if(getData) {
                response.status(200).json({
                    status: true,
                    message: 'data has been displayed.',
                    data: {
                        _id: getData._id,
                        title: getData.title ? getData.title : ''
                    }
                })
            }else {
                return response.status(200).json({
                    status: false,
                    message: 'data displayed is empty.'
                })
            }
        }else {
            let query = {}
            query['softDelete'] = null
            if(search) {
                query['title'] = new RegExp(`${search}`, 'i')
            }

            const getData = await Model.paginate(query, { page: page, limit: limit })
            if(getData.docs.length) {
                response.status(200).json({
                    status: true,
                    message: 'all data has been displayed.',
                    data: getData.docs.map((result) => {
                        return {
                            _id: result._id,
                            title: result.title ? result.title : ''
                        }
                    }),
                    page: getData.page,
                    limit: getData.limit,
                    total_data: getData.totalDocs,
                    total_page: getData.totalPages
                })
            }else {
                return response.status(200).json({
                    status: false,
                    message: 'data displayed is empty.'
                })
            }
        }
    }catch(error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.post = async (request, response, next) => {
    try {
        const findData = await Model.findOne({ $and: [{ title: sanitize(request.body.title) }, { softDelete: null }] })
        if(findData) {
            return response.status(400).json({
                status: false,
                message: 'data already exist.'
            })
        }else {
            let data = {}
            data['title'] = sanitize(request.body.title)

            const saveData = await Model.create(data)

            return response.status(201).json({
                status: true,
                message: 'data added successfully.'
            })
        }
    }catch(error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.put = async (request, response, next) => {
    const _id = request.query._id
    try {
        if(_id) {
            const findData = await Model.findOne({ $and: [{ _id: _id }, { softDelete: null }] })
            if(findData) {
                const findDuplicateData = await Model.findOne({ $and: [{ _id: { $ne: _id } }, { title: sanitize(request.body.title) }, { softDelete: null }] })
                if(findDuplicateData) {
                    return response.status(400).json({
                        status: false,
                        message: 'data already exist.'
                    })
                }else {
                    let data = {}
                    data['title'] = sanitize(request.body.title)

                    const updateData = await Model.updateOne({ _id: _id }, { $set: data })
                    return response.status(200).json({
                        status: true,
                        message: 'data changed successfully.'
                    })
                }
            }else {
                return response.status(400).json({
                    status: false,
                    message: '_id parameter not found.'
                })
            }
        }else {
            return response.status(400).json({
                status: false,
                message: '_id parameter not found.'
            })
        }
    }catch(error) {
        response.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.delete = async (request, response, next) => {
    const _id = request.query._id
    const hard = request.query.hard

    try {
        if(_id) {
            const findData = await Model.findOne({ _id: _id })
            if(findData) {
                if(hard == 'true' || hard == true) {
                    const deleteData = await Model.deleteOne({ _id: _id })
                }else {
                    const deleteData = await Model.updateOne({ _id: _id }, { $set: { softDelete: Date.now() } })
                }

                return response.status(200).json({
                    status: true,
                    message: 'data deleted successfully.'
                })
            }else {
                return response.status(400).json({
                    status: false,
                    message: '_id parameter not found.'
                })
            }
        }else {
            return response.status(400).json({
                status: false,
                message: '_id parameter not found.'
            })
        }
    }catch(error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}