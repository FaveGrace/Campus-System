const express = require('express');
const mongoose = require('mongoose');
const Campus = require('./campusModel');

const app = express();

const PORT = process.env.PORT || 7070;

app.use(express.json());

const MongoDb_Url = "mongodb+srv://favegrace:favegrace@cluster0.avj70at.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(MongoDb_Url)
    .then(() => {
        console.log("MongoDB connected successfully")
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    })

//     Scenario
// You're tasked with building the backend for a campus Lost & Found system. Security staff or students can log found items, and users can view, update, and manage those entries.

// Requirements:

// 1.Set up Node.js + Express + MongoDB


// 2.Create an Item model:

// itemName (String)
// description (String)
// locationFound (String)
// dateFound (Date)
// claimed (Boolean)


// 3.Implement CRUD operations:

// Add a found item
// View all unclaimed items
// View one item by ID
// Update an item’s details or mark as claimed
// Delete old/irrelevant entries

app.post("/create-found-item", async (req, res) => {
    const {itemName, description, locationFound, dateFound, claimed} = req.body;

    if (!itemName || !description || !locationFound) {
        return res.status(400).json({message: "Please fill all the fields"})
    }

    const foundItem = new Campus({
        itemName,
        description,
        locationFound,
        dateFound,
        claimed
    })
    await foundItem.save()
    res.status(201).json({
        message: "Found item created successfully", 
        foundItem})
})

app.get("/get-all-unclaimed-items", async (req, res) => {
    const unclaimedItems = await Campus.find();

    if(!unclaimedItems){
        return res.status(404).json({message: "No unclaimed items found"})
    }
    
    res.status(200).json({
        message: "Unclaimed items fetched successfully", 
        unclaimedItems})
})

app.get("/get-item/:id", async (req, res) => {
    const {id} = req.params;
    const oneItem = await Campus.findById(id);
    
    if (!oneItem) {
        return res.status(404).json({message: "Item not found"})
    }

    res.status(200).json({
        message: "Item fetched successfully", 
        oneItem})
})

app.patch("/update-item/:id", async (req, res) => {
    const {id} = req.params;
    const {claimed} = req.body;

    const lostItem = await Campus.findByIdAndUpdate(id)

    if (lostItem) {
        lostItem.claimed = claimed;
        await lostItem.save()
    
        return res.status(200).json({
            message: "Item has been claimed"})
    }

    res.status(404).json({
        message: "Item still unclaimed"})
})

app.delete("/delete-item/:id", async (req, res) => {
    const {id} = req.body;
    const deletedItem = await Campus.findByIdAndDelete(id)
    res.status(200).json({message: "Item deleted successfully"})
})