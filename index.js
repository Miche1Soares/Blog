const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const app = express()

const mongoose = require('mongoose')

const {senha, usuarios, session_secret} = require('./config.js')

const Posts = require('./Posts.js')

const session = require('express-session')

const fileupload = require('express-fileupload')

const fs = require('fs')


app.engine('html', require('ejs').renderFile)
app.set('view engine','html')
app.use('/public', express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, '/views'))


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(session({
    secret: session_secret,
    cookie: {maxAge: 120000}
}))

app.use(fileupload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'temp')
}))


mongoose.connect(`mongodb+srv://root:${senha}@cluster0.4jyb2.mongodb.net/Blog?retryWrites=true&w=majority` ,{useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log('conectado no mongodb')
})
.catch((err)=>{
    console.log('Erro ao conectar ao mondoDB: '+err.message)
})


app.get('/', (req,res)=>{

    if(req.query.busca == null){

        Posts.find({}).sort({'_id': -1}).exec((err, posts)=>{
            
            posts = posts.map((val)=>{
                return{
                    titulo: val.titulo,
                    conteudo: val.conteudo,
                    conteudoCurto: val.conteudo.substring(0,120),
                    imagem: val.imagem,
                    slug: val.slug,
                    categoria: val.categoria,
                    autor: val.autor
                }
            })

            Posts.find({}).sort({'views': -1}).limit(5).exec((err,postsTop)=>{

                postsTop = postsTop.map(function(val){
                    return {
                        titulo: val.titulo,
                        conteudo: val.conteudo,
                        descricaoCurta:val.conteudo.substr(0,120),
                        imagem: val.imagem,
                        slug: val.slug,
                        categoria: val.categoria,
                        views: val.views
                    }
                })

                res.render('index',{posts:posts,postsTop:postsTop})
            })
        })

    }
    
    else{

        Posts.find({}).sort({'views': -1}).limit(5).exec((err,postsTop)=>{

            postsTop = postsTop.map(function(val){
                return {
                    titulo: val.titulo,
                    conteudo: val.conteudo,
                    descricaoCurta:val.conteudo.substr(0,120),
                    imagem: val.imagem,
                    slug: val.slug,
                    categoria: val.categoria,
                    views: val.views
                }
            })

            Posts.find({titulo: {$regex: req.query.busca, $options: 'i'}}, (err, posts)=>{
            
                posts = posts.map(function(val){
                    return {
                        titulo: val.titulo,
                        conteudo: val.conteudo,
                        conteudoCurto: val.conteudo.substring(0,120),
                        imagem: val.imagem,
                        slug: val.slug,
                        categoria: val.categoria,
                        autor: val.autor
                    }
                })

                res.render('busca',{posts:posts, contagem:posts.length, postsTop:postsTop})
            })

        })

    }    

})

app.get('/:slug',(req,res)=>{

    if(req.query.busca == null){

        Posts.findOneAndUpdate({slug: req.params.slug}, {$inc: {views: 1}}, {new: true}, function(err,resposta){
        
            if(resposta != null){

                Posts.find({}).sort({'views': -1}).limit(5).exec((err,postsTop)=>{

                    postsTop = postsTop.map(function(val){
                        return {
                            titulo: val.titulo,
                            conteudo: val.conteudo,
                            descricaoCurta:val.conteudo.substr(0,120),
                            imagem: val.imagem,
                            slug: val.slug,
                            categoria: val.categoria,
                            views: val.views
                        }
                    })
    
                    res.render('single',{noticia:resposta, postsTop:postsTop})
                })

            }
            else{
                res.redirect('/')
            }
    
        })        

    }else{

        Posts.find({}).sort({'views': -1}).limit(5).exec((err,postsTop)=>{

            postsTop = postsTop.map(function(val){
                return {
                    titulo: val.titulo,
                    conteudo: val.conteudo,
                    descricaoCurta:val.conteudo.substr(0,120),
                    imagem: val.imagem,
                    slug: val.slug,
                    categoria: val.categoria,
                    views: val.views
                }
            })

            Posts.find({titulo: {$regex: req.query.busca, $options: 'i'}}, (err, posts)=>{
            
                posts = posts.map(function(val){
                    return {
                        titulo: val.titulo,
                        conteudo: val.conteudo,
                        conteudoCurto: val.conteudo.substring(0,120),
                        imagem: val.imagem,
                        slug: val.slug,
                        categoria: val.categoria,
                        autor: val.autor
                    }
                })

                res.render('busca',{posts:posts, contagem:posts.length, postsTop:postsTop})
            })

        })

    }    
    
})

app.get('/admin/login', (req,res)=>{

    if(req.session.login == null){

        res.render('admin-login')

    }else{

        Posts.find({}).sort({'_id': -1}).exec((err, posts)=>{
            
            posts = posts.map((val)=>{
                return{
                    id: val._id,
                    titulo: val.titulo,
                    conteudoCurto: val.conteudo.substring(0,60)
                }
            })

            res.render('admin-painel', {posts:posts})
        })

    }    

})

app.post('/admin/login', (req,res)=>{

    usuarios.map((val)=>{

        if(val.login == req.body.login && val.senha == req.body.senha){
            
            req.session.login = 'Magno'

        }

    })

    res.redirect('/admin/login')

})

app.post('/admin/cadastro', (req,res)=>{

    let formato = req.files.arquivo.name.split('.')
    var imagem = ''

    if(formato[formato.length - 1] == 'jpeg'){

        imagem = new Date().getTime()+'.jpeg'
        req.files.arquivo.mv(__dirname+'/public/images/'+ imagem)

    }else if(formato[formato.length - 1] == 'png'){

        imagem = new Date().getTime()+'.png'
        req.files.arquivo.mv(__dirname+'/public/images/'+ imagem)

    }else{

        fs.unlinkSync(req.files.arquivo.tempFilePath)

    }

    var slug = (titulo) => {
        let slugEdit = []
        let slugFrase = ''
        for(let i=0; i<titulo.split(' ').length; i++)
        {
            slugEdit.push(titulo.split(' ')[i])
            slugEdit.push('-')
        }
        slugEdit.pop()
        for(let i=0; i<slugEdit.length; i++)
        {
            slugFrase += `${slugEdit[i].toLowerCase()}`
        }
        return slugFrase
    }
    
    Posts.create({
        titulo: req.body.titulo_noticia,
        imagem: 'http://localhost:5000/public/images/'+imagem,
        categoria: req.body.categoria,
        conteudo: req.body.noticia,
        slug: slug(req.body.titulo_noticia),
        autor: usuarios[0].nome_autor
    })
    
    res.redirect('/admin/login')

})

app.get('/admin/deletar/:slug',(req,res)=>{

    Posts.deleteOne({_id:req.params.slug}).then(()=>{
        res.redirect('/admin/login')
    })    

})

app.listen(5000, ()=>{
    console.log('rodando')
})