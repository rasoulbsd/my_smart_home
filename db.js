var MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');
const { DB_URI, COLLECTION_NAME, DB_NAME } = require('./.credentials.json');



module.exports = {
    async initialize_db_connection(){
        return (
            await MongoClient.connect(DB_URI, {connectTimeoutMS: 50000})
                .then(async (db) => {
                    console.log('\x1b[32m%s\x1b[0m',"Connected to database successfully"); // green
                    return db;
                }).catch(function (error) {
                    console.log('\x1b[31m%s\x1b[0m', "Error in connecting to database: " + error) // red
                    throw error;
                })
        )
    },

    async mongo_get_urls(db, BRAND_NAME) {
        var dbo = await db.db('urls2');
        var query = {};
        const result = await dbo.collection(BRAND_NAME).find(query)
        return await result.toArray();
    },


    async get_a_product(db, BRAND_NAME, mongo_product_id) {
        var dbo = await db.db('brands');
        if (mongo_product_id == '' || mongo_product_id == undefined)
            return []
        // console.log("mongo_product_id")
        console.log(`mongo_product_id: ${mongo_product_id}`)
        var query = { "_id":  new ObjectId(mongo_product_id)};
        const result = await dbo.collection(BRAND_NAME).find(query)
        return (await result.toArray());
    },

    async get_a_product_trendyol(db, BRAND_NAME, dd_product_id) {
        var dbo = await db.db('trendyol_brands');
        if (dd_product_id == '' || dd_product_id == undefined)
            return []
        var query = { "dd_product_id":  dd_product_id};
        const result = await dbo.collection(BRAND_NAME).find(query)
        return (await result.toArray());
    },

    async get_products(db, BRAND_NAME, DB_NAME='brands', query={}){
        // console.log(BRAND_NAME)
        // console.log(DB_NAME)
        // console.log(query)

        const dbo = await db.db(DB_NAME);
        // const options = {skip, limit};
        // const options = {skip:(skip - 1) * limit, limit};
        // console.log(typeof(skip))
        // console.log(skip)
        // console.log(limit)
        // console.log(options)
        // console.log(query)
        const options = {skip: 20000, limit: 20000}
        // options = {}
        const result = await dbo.collection(BRAND_NAME).find(query, options)
        return await result.toArray();
    },

    // async update_id_mongo(db, data, dd_product_id, BRAND_NAME, DB_NAME='trendyol_brands'){
    //     var dbo = await db.db(DB_NAME);
    //     const options = { upsert: true, new: true };
    //     data['dd_product_id'] = dd_product_id;

    //     var query = { "_id":  new ObjectId(data._id)};
    //     console.log(data)
    //     var newvalues = { $set: data };
    //     console.log(BRAND_NAME)
    //     console.log(DB_NAME)
    //     console.log(newvalues)
    //     const response = await dbo.collection(BRAND_NAME).updateOne(query, newvalues)
    //         .then(async (res) => {
    //             console.log(`Updated didoka-product-id sucessfully in mongodb: ${data._id}`);
    //             console.log(res)
    //             // console.log(data._id)
    //             return 200;
    //         })
    //         .catch(async function (error) {
    //             console.log('\x1b[31m%s\x1b[0m', "Error in sending: " + error); //red
    //             return 0;
    //         })
    //     return response;
    // },

    async set_lamp(db, id, value) {
        const dbo = await db.db(DB_NAME);
        const collection = dbo.collection(COLLECTION_NAME);
        
        // Find the document by its ID
        const filter = { id };
        const existingDocument = await collection.findOne(filter);
      
        if (!existingDocument) {
        //   throw new Error("\x1b[31m%s\x1b[0m", `Document with ID ${mongo_id} not found`); // red
            const result = await collection.insertOne({
                id,
                value
            });
            return result;
        }
      
        // Update the document with the new attribute
        const update = {
                            $set: { value: value.toLowerCase()=="true" ? true : false }
                        };
        const options = { returnOriginal: true };
        const result = await collection.findOneAndUpdate(filter, update, options);
        // console.log('\x1b[32m%s\x1b[0m', `Updated didoka-product-id sucessfully in mongodb: ${mongo_id}`); // green

        // Return the updated document
        return result.value;
      },
      async get_lamp(db, id) {
        const dbo = await db.db(DB_NAME);
        const collection = dbo.collection(COLLECTION_NAME);
        
        // Find the document by its ID
        const filter = { id };
        const existingDocument = await collection.findOne(filter);
      
        if (!existingDocument) {
          throw new Error("\x1b[31m%s\x1b[0m", `Document with ID ${mongo_id} not found`); // red
        }
        return existingDocument["value"];
      },

}
