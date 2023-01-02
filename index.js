const express = require('express')
const path = require('path')

const app = express()


app.engine('html', require('ejs').renderFile)
app.set('view engine','html')
app.use('/public', express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, '/views'))



app.get('/', (req,res)=>{

    res.render('index')    

})

app.get('/busca', (req,res)=>{

    res.render('busca')    

})

app.get('/single', (req,res)=>{

    res.render('single')    

})

app.get('/admin/login', (req,res)=>{

    res.render('admin-login')    

})

app.get('/admin/painel', (req,res)=>{

    res.render('admin-painel')    

})

app.listen(5000, ()=>{
    console.log('rodando')
})