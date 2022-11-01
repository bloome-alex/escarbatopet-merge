const Category = require('../modules/models/Category')

const categories = ['ALIMENTO', 'INDUMENTARIA', 'ACCESORIOS', 'JUGUETES', 'PRODUCTOS VETERINARIOS', 'PLANTAS', 'MACETAS']

const initCategories = async() => {
    const isCategory = await Category.find({})
    if(isCategory.length > 0){
        await Category.updateOne({id:isCategory._id}, {categories})
    }else{
        await Category.create({
            categories 
        })
    }
    console.log('Categories are created')
}

initCategories()
