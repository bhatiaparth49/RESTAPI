const router = require('express').Router()
const Article = require('../models/article')

router.post('/', async (req, res) => {
    const {title, body, author} = req.body

    const article = new Article({
        title,
        body,
        author
    })

    /* article.save((err, document) => {
        if(err) {
            throw err
        }
        res.status(201).json(document);
    }) */

    /* article.save().then(document => {
        res.status(201).json(document)
    }).catch(err => {
        throw err
    }) */
    
    try{
        const document = await article.save()
        return res.status(201).json(document)
    } catch {
         throw err
    }
    


})

router.get('/:id', (req, res) => {
       const { id } = req.params
       Article.findOne({ _id: id }, (err, document) => {
           if(err){
               throw err
           }

           if(document) {
              return res.json(document)
           } else {
               return res.status(404).json({ error: 'Article not found'})
           }
       })
})

router.patch('/:id', (req, res) => {
    const { id } = req.params
    const {title, body, author} = req.body
    Article.findOne({ _id: id }, (err, document) => {
        if(err) {
            throw err
        }
        if(document) {
            Article.updateOne({ _id: id}, {
                title,
                body,
                author
            }).then(status => {
                return res.json(req.body)
            }).catch(err => {
                throw err
            })

        } else {
            return res.status(404).json({ error: 'Article not found'})
        }
    })
})

router.get('/', (req, res) => {
    // fetch
    Article.find((err, articles) => {
        if(err) {
            throw err
        }
        return res.json(articles)
    })
})

router.delete('/:_id', (req, res) => {
    const { _id } = req.params
    Article.deleteOne({ _id }).then((status) => {
        console.log(status)
        return res.json({ id: _id})
    }).catch(err => {
        return res.status(500).json({error: 'Something went wrong'})
    })
})
module.exports = router