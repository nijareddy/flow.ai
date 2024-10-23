const express=require('express')
const app=express()

app.use(express.json())

const {open}=require('sqlite')
const sqlite3=require('sqlite3')

const path=require('path')
const dbpath=path.join(__dirname,'personal_expenser_tracker.db')


let db;

const initializeConnection=async ()=>{
  try {

     db=await open({
       filename:dbpath,
       driver:sqlite3.Database
      })

      app.listen(3004,()=>{
        console.log(`Server is running at http://localhost:3004`)
      })
   }
   catch(e){
    console.log(`The Error Message is ${e}`)
   }

}

initializeConnection()


app.post('/transactions',async (req,res)=>{

    const {type,category,amount,date,description}=req.body

    const addTransaction=`
       INSERT INTO transactions(type,category,amount,date,description)
       VALUES('${type}',${category},${amount},'${date}','${description}');
    `

    await db.run(addTransaction)
    return res.status(201).json({message:'Transaction successfully created!!'})
    
})

// API 2 

app.get('/transactions',async (req,res)=>{
    const getTransactions=`
     SELECT * FROM transactions;
    `

    const runQuery=await db.all(getTransactions);

    res.send(runQuery)

})

// API 3 

app.get('/transactions/:id',async (req,res)=>{
    const {id}=req.params

    const singleTransaction=`
      SELECT * FROM transactions WHERE id=${id};
    `

    const runSingleTransaction=await db.get(singleTransaction)

    if (runSingleTransaction===undefined){
      return res.status(404).json({message:'Transaction does not exist'})
    }    return res.status(200).json(runSingleTransaction)
})

app.put('/transactions/:id',async (req,res)=>{
    const {id}=req.params

    const chkTransaction=`
      SELECT * FROM transactions WHERE id=${id};
    `

    const runchkTransaction=await db.get(chkTransaction)

    if (runchkTransaction===undefined){
        return res.status(404).json({message:'Transaction does not exist'})
    }


   
    const {type,category,amount,date,description}=req.body

    const updTransaction=`
       UPDATE transactions SET type='${type}', 
       category='${category}', 
       amount='${amount}',
       date='${date}',
       description='${description}' 
       WHERE id='${id}'; 
    `
    await db.run(updTransaction);

    return res.status(200).json({message:'Transaction updated successfully!!'})
    
})