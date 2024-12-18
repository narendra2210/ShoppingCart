const BaseJoi = require('joi');
const sanitizeHTML = require('sanitize-html');

const extension =(joi)=>{
    return{
        type:'string',
        base:joi.string(),
        messages:{
            'string.escapeHTML': '{{#label}} must not include HTML!'
        },
        rules:{
            escapeHTML:{
                validate(value,helpers){
                    const clean = sanitizeHTML(value,{
                        allowedTags:[],
                        allowedAttributes:{},
                    });
                    if(clean !== value){
                        return helpers.error('string.escapeHTML',{value});
                    }
                    return clean;
                }
            }
        }
    }
}

const Joi = BaseJoi.extend(extension);

const productSchema = Joi.object({
    name: Joi.string().required().escapeHTML(),
    price: Joi.string().min(0).required(),
    desc: Joi.string().required().escapeHTML()

});


const reviewSchema = Joi.object({
    rating: Joi.number().min(0).max(5).required(),
    comment: Joi.string().required().escapeHTML()

});

const userSchema = Joi.object({
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required()
            .escapeHTML(),

        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        email: Joi.string()               
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        role:Joi.string().required().escapeHTML()
});

module.exports={productSchema,reviewSchema,userSchema};
