/*  Buatlah sebuah database bernama bazaar
    Buatlah 3 collection dengan nama stands, customers, dan transactions
*/

//  Activate database
use bazaar

/*  mengakses database dan fungsi lainnya seperti mengakses object
    untuk mengakses collection stands, gunakan db.stands
*/

/**
 * CREATE
 * Terdapat 2 cara untuk melakukan insert, yaitu: 'insertOne' dan 'insertMany'
 */

//  'insertOne' digunakan untuk memasukkan satu document ke dalam collection.
db.customers.insertOne({
    "name": "Mikhael",
    "age": 21,
    "email": "mikhael@example.com"
})

//  'insertMany' digunakan untuk memasukkan lebih dari satu document ke dalam collection.
db.customers.insertMany([{
    "name": "Enrico",
    "age": 21,
    "email": "enrico@example.com"
},{
    "name": "Cherilyn",
    "age": 20,
    "email": "cherilyn@example.com"
}])

/**
 * hati hati saat melakukan insert karena perbedaan mongoDB tidak melakukan pengecekan perbedaan key
 * data dibawah memiliki perbedaan key dari "name" menjadi "nama" dan "age" menjadi "umur"
 * apabila perintah dibawah dijalankan, mongoDB akan tetap menyimpan dan tidak ada error. 
 */  
db.customers.insertOne({
    "nama": "Kevin",
    "umur": 22,
    "email": "kevin@example.com"
})

/**
 * READ 
 * Untuk melakukan Read, terdapat banyak fungsi yang dapat digunakan.
 * Fungsi yang paling umum digunakan adalah 'find' dan 'findOne'
 * 'find' digunakan untuk mengambil lebih dari satu data 
 * 'findOne' digunakan untuk mengambil satu data saja
 */

//  mengambil seluruh data customers
db.customers.find()

//  mengambil elemen pertama dari customers
db.customers.findOne()

//  kita bisa memberikan kondisi untuk mencari data tertentu
db.customers.find({email:'bob@example.com'})
db.customers.find({name:'Bob'})

/**
 * PROJECTION
 * projection merupakan cara untuk menentukan field apa yang ingin ditampilkan
 * contoh pada tabel customer, kita hanya ingin nama dan email
 */
db.customers.find({}, {
    name:1, email:1
})

// Apabila kita tidak ingin menampilkan _id, kita dapat memberikan nilai 0
db.customers.find({}, {
    name:1, email:1, _id:0
})

// Apabila field banyak dan kita hanya ingin mengexclude beberapa field saja, kita dapat memberikan nilai 0
db.customers.find({}, {
    age: 0, email: 0
})

// Kita tidak bisa mengkombinasikan projection 1 dan 0(kecuali untuk _id)
/*! perintah dibawah akan error */
db.customers.find({}, {
    age: 0, email:1
})

/**
 * OPERATOR
 * terdapat beberapa operator yang dapat digunakan seperti
 * 1. Comparison Operator
 * $eq, $ne, $gt, $gte, %$lt, $lte, $in, $nin
 * 2. Logical Operator
 * $and, $or, $not, $nor
 */

// Comparison Operator
db.customers.find({ age: { $lte: 30 }})
db.customers.find({ age: { $lt: 50, $gt: 30 }})
db.customers.find({ name: { $in: ['Dave', 'Bob'] }})

// Logical Operator
db.customers.find({ $and: [
    { age: { $lte: 30 } },
    { name: { $in: ['Enrico', 'Cherilyn'] } }
] })

/// UPDATE ///
/**
 * Untuk melakukan update, terdapat 2 fungsi utama yaitu updateOne dan updateMany
 * updateOne digunakan untuk mengupdate hanya satu data saja yang sesuai dengan kondisi yang diberikan.
 * updateMany digunakan untuk mengupdate semua data yang sesuai dengan kondisi yang diberikan.
 */

db.customers.updateOne({
    email: 'cherilyn@example.com'
},{ $set: {
    age: 21
} })

db.customers.updateMany({
    name: { $in: ['Enrico', 'Cherilyn'] }
},{
    $set: {
        age: 20
    }
})

/**
 * UPDATE OPERATOR
 * terdapat beberapa operator yang dapat digunakan pada update method.
 * $inc: menambah nilai dengan jumlah tertentu
 * $rename: mengubah nama field
 * $set: mengganti nilai field menjadi suatu value
 * $unset: menghapus field
 * $currentDate: set value sebagai date sekarang
 * $addToSet: menambah value ke array apabila unique
 * $pop: menghapus element pertama atau terakhir pada array
 * $pull: menghapus seluruh elemen pada array
 * $push: menambah item baru ke array
 */

//increment
db.customers.updateMany({},{
    $inc: {
        age: 1
    }
})

//set
db.customers.updateOne({
    nama: 'Kevin'
},{
    $set:{
        status: 1
    }
})

//unset
db.customers.updateOne({
    nama: 'Kevin'
}, {
    $unset: {status:''}
})


//rename
db.customers.updateOne({
    nama: 'Kevin'
}, {
    $rename: {
        nama: 'name'
    }
})

//currentDate
db.customers.updateOne({
    email: 'kevin@example.com'
}, {
    $set: {
        joined_at: new Date()
    }
})

db.customers.updateOne({
    email: 'kevin@example.com'
},{
    $currentDate: {
        joined_at: true
    }
})

//addToSet
//perintah di bawah tidak akan mengupdate karena pada Fruit Stand sudah ada Apples
db.stands.updateOne({
    name: 'Fruit Stand'
},{
    $addToSet: {
        items: 'Apples'
    }
})

db.stands.updateOne({
    name: 'Fruit Stand'
},{
    $addToSet: {
        items: 'Mangos'
    }
})

//pop
//untuk melakukan pop dari depan gunakan value -1, dan 1 untuk dari belakang
db.stands.updateOne({
    name: 'Fruit Stand'
},{
    $pop: {
        items: -1
    }
})

db.stands.updateOne({
    name: 'Fruit Stand'
},{
    $pop: {
        items: 1
    }
})

//pull
db.stands.updateOne({
    name: 'Meat Stand'
},{
    $pull: {
        items: 'Pork'
    }
})

//push
db.stands.updateOne({
    name: 'Meat Stand'
},{
    $push: {
        items: 'Pork'
    }
})

//push multiple items
db.stands.updateOne({
    name: 'Fruit Stand'
},{
    $push: {
        items: {
            $each: ['Apples', 'Mangos', 'Grapes']
        }
    }
})

// Kita juga memberikan sebuah tambahan opsi pada update
// jika kita ingin, apabila data yang ingin diupdate tidak ada
// mongoDB akan langsung membuat sebuah document dengan ddata yang diberikan
db.customers.updateOne({
    name: "Odi"
},{
    $set: {
        name: "Odi",
        email: "odi@example.com",
        age: 21
    }
},{ 
    upsert: true 
});


/**
 * DELETE OPERATOR
 * Untuk melakukan delete, kita akan menggunakan 2 perintah, yaitu:
 * 1. deleteOne: perintah untuk menghapus satu data yang ditemukan sesuai kondisi yang dicari
 * 2. deleteMany: perintah untuk menghapus semua data yang ditemukan sesuai kondisi yang dicari
 */
db.customers.insertMany([{
    name: "test1",
    role: "test"
},{
    name: "test2",
    role: "test"
},{
    name: "test3",
    role: "test"
}])

db.customers.deleteOne({
    name: "test1"
})

db.customers.deleteMany({
    role: "test"
})

/**
 * AGGREGATION PIPELINE FUNCTION
 * Aggregation function memberikan opsi untuk melakukan sorting, grouping, dan beberapat perhitungan lainnya
 * Beberapa aggregate function yang dapat digunakan antara lain:
 * 1. $group
 * 2. $limit
 * 3. $project
 * 4. $sort
 * 5. $match
 * 6. $addFields
 * 7. $lookup
 * 8. $count
 */

//group
db.stands.aggregate([
    { $group: { _id: '$owner' } }
])

//limit
db.customers.aggregate([
    { $limit: 3 }
])

//project
db.stands.aggregate([
    { 
        $project: {
            name: 1,
            owner: 1
        } 
    }
])

//sort ascending
db.customers.aggregate([
    {
        $sort: {
            age: 1
        }
    }
])

//sort descending 
db.customers.aggregate([
    {
        $sort: {
            age: -1
        }
    }
])

//match 
db.stands.aggregate([
    {
        $match: {
            owner: 'John Doe'
        }
    }
])

//addField
db.stands.aggregate([
    {
        $addFields: {
            isOpen: true
        }
    }
])

//lookup
db.transactions.aggregate([
    { 
        $lookup: {
            from: 'stands',
            localField: 'stand_id',
            foreignField: '_id',
            as: 'stand'
        }
    },
    { 
        $lookup: {
            from: 'customers',
            localField: 'customer_id',
            foreignField: '_id',
            as: 'customer',
        }
    }
])

//count
db.customers.aggregate([
    { $count: 'number_of_customer' }
])

db.customers.aggregate([
    { $match: {
        age: { $gt: 30 }
    }},
    { $count: 'number of customer > 30' }
])

/**
 * AGGREGATE OPERATOR
 * Terdapat beberapa operator tambahan yang dapat digunakan pada hasil aggregasi, sepert:
 * $sum, $avg, $min, $max, $count, $exp, $mod, $multiply, $add, $subtract
 */

db.transactions.aggregate([
    /**
     * Dilakukan penggabungan tabel terlebih dahulu dengan tabel stand
     */
    {
        $lookup: {
            from: 'stands',
            localField: 'stand_id',
            foreignField: '_id',
            as: 'stand'
        }
    },
    /**
     * Pengelompokkan data berdasarkan owner stand
     */
    { 
        $group: {
            _id: "$stand.owner",                // mengambil field owner dari stand sebagai grouping subject
            totalIncome: { $sum: '$total' },    // melakukan perhitungan total dari seluruh data, dikelompokkan berdasarkan stand.owner
            totalTransaction: { $sum: 1 },      // menghitung jumlah transaksi yang dilakukan
            transactions: { $push: '$_id' }     // menyimpan id transaksi sebagai list
        }
    },
    /**
     * projeksi untuk mengontrol apa yang ditampilkan
     */
    {
        $project: {
            owner: {
                $arrayElemAt: ["$_id", 0]   //mengambil element ke berapa dari array, karena 
            },
            totalIncome: 1,
            totalTransaction:1,
            transactionList: '$transactions',   //perubahan nama transactions menjadi transactionList
            _id: 0
        }
    }
])