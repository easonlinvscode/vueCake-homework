export default {
  props:['id'],
  template:'#userProductModal',
  watch:{
   id(){
    this.getProduct()
   }
  },
  data(){
    return{
     modal:{},
     product:{},
     qty:1
     
    }
  },
  methods:{
   openModal(){
     this.modal.show()
   },
   closeModal(){
     this.modal.hide()
     this.qty=1
   },
   getProduct(){
     axios.get(`${apiUrl}/api/${apiPath}/product/${this.id}`)
     .then((res) =>{
      //  console.log(res);
       this.product=res.data.product
      //  console.log(this.product);
     })
   },
   addToCart(){
     this.$emit('add-cart',this.product.id ,this.qty)
   }
  },
  mounted() {
    this.modal=new bootstrap.Modal(this.$refs.modal)
  },
  }