const rentModel = require('../models/Rent')
const carModel = require('../models/Car')
const rentCtrlr = {}

rentCtrlr.getRents = async (req,res) =>{
   var rentList = await rentModel.find()
   res.json(rentList)
}

rentCtrlr.createRent = async (req,res) =>{
    const {idUser,pickUp,dropOff, days,pickHour,dropHour} = req.body

    const newRent = new rentModel({
        idUser,pickUp,dropOff,days,pickHour,dropHour
    })

    await newRent.save()
    .then((response) => res.json({response}))
    .catch((err) =>res.json({err}))
}

rentCtrlr.updateRent = async (req,res) =>{
    const {id} = req.params.id
    const {idCar,price,confirmed} = req.body

    const oldRent = await rentModel.findById(id)
    const newRent = {
        ...oldRent,
        idCar,
        price,
        confirmed
    }
        await rentModel.findByIdAndUpdate(id, newRent)
        .then((response) => res.json({response}))
        .catch((err) => res.json({err}))


}

rentCtrlr.deleteRent = async (req,res) =>{
    const id = req.params.id

    await rentModel.findByIdAndDelete(id)

}
rentCtrlr.searchCarsavailable = async (req,res) =>{
    const {pickUp,dropOff} = req.body
    const cars =await carModel.find()
    const rents =await rentModel.find()
    const listAvailable = []
    cars.forEach(car => {
        var available = true
        rents.forEach(rent => {
            if(rent.idCar==car._id){
                if(new Date(rent.pickUp)>=new Date(pickUp) && new Date(rent.dropOff)<=new Date(dropOff)){
                    available = false
                }     
            }

           
        })
        if(available){
        listAvailable.push(car)
        }
    })
    res.json(listAvailable)
    

}


module.exports = rentCtrlr