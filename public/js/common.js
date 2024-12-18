console.log("connected");
const allLikeButton = document.querySelectorAll('.like-btn');

async function likeButton(productId , btn){
    try{
        let response = await axios({
            method: 'post',
            url: `/product/${productId}/like`,
            headers: {'X-Requested-With': 'XMLHttpRequest'}, // headers ka use krte hai to send the extra information means hum header m y bata rhe hai we are sending xhr request
        });
        console.log(response);
        //status is 200 means successfull request
        console.log(btn.children[0]);
        //  if else m jo conditions likhi hai these are client side rendering
        if(btn.children[0].classList.contains('fas')){
            btn.children[0].classList.remove('fas')
            btn.children[0].classList.add('far')
        } else{
            btn.children[0].classList.remove('far')
            btn.children[0].classList.add('fas')
        }
        // console.log(response);
    }
    catch (e) {
        window.location.replace('/login'); //redirect
    }
}


for(let btn of allLikeButton){
    btn.addEventListener('click' , ()=>{
        let productId = btn.getAttribute('product-id'); // isse uss product ki id aa jayegi jis product ko user ne like kiya hai
        console.log(productId)
        likeButton(productId,btn);
    })
}