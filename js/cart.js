// import productModal from './userProductModal.js';


const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

configure({
  generateMessage: localize('zh_TW'),
});

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'vue-cake';

Vue.createApp({
  data() {
    return {
      cartData: {
        carts:[]
      },
      products:[],
      productId:'',
      isLoadingItem:'',
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
      },
    };
  },
  components: {
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  methods: {
     // 帶入產品data
     getProducts(){
      axios.get(`${apiUrl}/api/${apiPath}/products/all`)
        .then((res)=>{
          // console.log(res);
          this.products=res.data.products
          // console.log(this.products);
        })
    },
    // 打開 product-modal元件
    openProductModal(id){
      this.productId= id
      // console.log(this.productId);
     this.$refs.productModal.openModal()
    },
     //加入購物車
     addToCart(id,qty = 1){
      const data={
        product_id:id,
        qty
      }
      this.isLoadingItem = id;
      axios.post(`${apiUrl}/api/${apiPath}/cart`,{data})
          .then((res)=>{
            console.log(res);
            this.getCart()
            this.isLoadingItem=''
            this.$refs.productModal.closeModal()
          })
    },
     // 更新購物車列表品項數量
     updateCartItem(item){
      const data={
        product_id:item.id,
        qty:item.qty
      }
      this.isLoadingItem = item.id;
      axios.put(`${apiUrl}/api/${apiPath}/cart/${item.id}`,{data})
          .then((res)=>{
            // console.log(res);
            alert(res.data.message);
            this.getCart()
            this.isLoadingItem=''
          }).catch((err) => {
            alert(err.data.message);
            this.isLoadingItem = '';
          });
    },
    // 刪除購物車所有品項
    removerCartAll(){
      axios.delete(`${apiUrl}/api/${apiPath}/carts`)
     .then((res)=>{
      //  console.log(res);
      alert(res.data.message);
       this.getCart()
       console.log(this.cartData.carts);
     })
     .catch((error) =>{
      //  console.log(error.data.message);
       alert(error.data.message)
     })
    },
    // 取得購物車列表
    getCart(){
      axios.get(`${apiUrl}/api/${apiPath}/cart`)
      .then((res)=>{
        // console.log(res);
        this.cartData = res.data.data
      })
    },
     // 刪除購物車單一品項
     removerCartItem(id){
      //  console.log(id);
      this.isLoadingItem = id;
      axios.delete(`${apiUrl}/api/${apiPath}/cart/${id}`)
       .then((res)=>{
         console.log(res);
         this.getCart()
         this.isLoadingItem = ''
       })
      },
    // 送出表單驗證
    createOrder() {
      const url = `${apiUrl}/api/${apiPath}/order`;
      const order = this.form;
      axios.post(url, { data: order }).then((response) => {
        alert(response.data.message);
        // 送出表單時重置表單，且不會觸發驗證
        this.$refs.form.resetForm();
        this.getCart();
      }).catch((err) => {
        alert(err.data.message);
      });
    },
  },
  mounted() {
    // 執行：帶入產品data
    this.getProducts()
    // 執行；取得購物車列表
    this.getCart()
  },
})
  .component('product-modal', {
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
    })
  .mount('#app');
