import {
    createApp
} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

//產品modal
let productModal = ''
let deleteModal=''


const app = createApp({
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'vue-cake',
            products: [],
            tempProduct: {},
            viewTempProduct: {},
            logoutBtn:true,
            createBtnText:false,
            // confirmBtnText:false
        }
    },
    methods: {
        // 取得產品資料
        getProducts() {
            axios.get(`${this.apiUrl}/api/${this.apiPath}/products/all`)
                .then(response => {
                    this.products = [...response.data.products];
                    console.log(this.products);
                })
                .catch(error => {
                    console.dir(error.data.message);
                })
               
        },
        //新增產品
        createProduct() {
            axios['post'](`${this.apiUrl}/api/${this.apiPath}/admin/product`, { data: this.tempProduct })
                // 成功的結果
                .then((response) => {
                    //若成功新增
                    if (response.data.success) {
                        //彈出成功新增訊息
                        alert('新增成功');
                        //關閉Modal
                        productModal.hide();
                        //重新抓畫面的List
                        this.getProducts();
                        //清除tempProduct
                        this.RemoveTempProduct()
                    }
                })
                // 失敗的結果
                .catch((err) => {
                    // alert('新增產品失敗');
                    console.dir(err);
                })
        },
        openModal(isNew,item){
           
           // 建立新產品modal
           if(isNew === 'new'){
               this.createBtnText=true
            //    this.confirmBtnText=false
               this.tempProduct={
                //圖片   
                imagesUrl:[],
                //標題
                title:'',
                //分類
                category:'',
                //單位
                unit: '',
                //原價
                origin_price: '',
                //售價
                price: '',
                //產品描述
                description: '',
                //說明內容
                content: '',
                //是否啟用
                is_enabled: false
               }
               this.isNew = true;
               productModal.show();
               
           // 編輯modal
           }else if(isNew === 'edit'){
            // this.confirmBtnText=true
            this.createBtnText=false
            this.isNew = false;
            this.tempProduct = { ...item };
            productModal.show();

           // 刪除modal
           }else if( isNew === 'delete' ){
               this.isNew = false
               this.tempProduct = { ...item };
               deleteModal.show()
           }
        },
         //刪除選取到的產品
         deleteProduct(){
            axios.delete(`${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`)
                .then(response => {
                    if (response.data.success){
                        alert(response.data.message)
                        deleteModal.hide()
                        this.getProducts()
                        this.RemoveTempProduct()
                    }
                })
                .catch(error => {
                    // console.dir(error.data.message);
                    alert('刪除產品失敗');
                })
            // console.log(item.id);
        },
        //清空暫存的產品
         RemoveTempProduct() {
             this.tempProduct = {}
         },
         //在暫存產品物件內建立 imagesUrl多圖陣列
         createImages() {
             this.tempProduct.imagesUrl = [];
             this.tempProduct.imagesUrl.push('');
         },
         



        // 編輯產品
        editProduct(){
            axios['put'](`${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`, { data: this.tempProduct })
                // 成功的結果
                .then((response) => {
                    //若成功編輯
                    if (response.data.success) {
                        //彈出成功編輯訊息
                        alert('編輯成功');
                        //關閉Modal
                        productModal.hide();
                        //重新抓畫面的List
                        this.getProducts();
                        //清除tempProduct
                        this.RemoveTempProduct()
                    }
                })
                // 失敗的結果
                .catch((err) => {
                    alert('編輯產品失敗');
                })
        },
        // 刪除產品
        
        // 登出
        logout(){
        this.logoutBtn = false
        axios.post(`${this.apiUrl}/logout`)
            .then(response=>{
                console.log(response.data);
                if(response.data.success){
                parent.window.location.replace('./index.html');
            }
            })
            .catch(error=>{console.dir(error);})
    },
    // 查看是否登入
    checkLoginStatus(){
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)cakeToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        axios.defaults.headers.common.Authorization = `${token}`;

        axios.post(`${this.apiUrl}/api/user/check`)
        .then(response=>{
            console.log(response.data);
            if(response.data.success == false){
                parent.window.location.replace('./index.html');
                alert(response.data.message);
            }
        })
        .catch(error=>
            {parent.window.location.replace('./index.html');
            alert('請重新登入')
        })
    },
    },
    mounted() {
        this.getProducts();
        // 建立bootstrap模型
        productModal = new bootstrap.Modal(document.querySelector('#productModal'))
         // 建立刪除模型
        deleteModal = new bootstrap.Modal(document.querySelector('#deleteModal'))
        
    },
    created() {
    this.checkLoginStatus();
},

})

app.mount("#app")