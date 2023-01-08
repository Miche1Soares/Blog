const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const app = express()

const mongoose = require('mongoose')

const {senha} = require('./config.js')

const Posts = require('./Posts.js')


app.engine('html', require('ejs').renderFile)
app.set('view engine','html')
app.use('/public', express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, '/views'))


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
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

    res.render('admin-login')    

})

app.get('/admin/painel', (req,res)=>{

    res.render('admin-painel')    

})

app.listen(5000, ()=>{
    console.log('rodando')
})