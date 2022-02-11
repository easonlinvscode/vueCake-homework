import {
    createApp
} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

const url = 'https://vue3-course-api.hexschool.io/v2'; // 請加入站點
const path = 'vue-cake'; // 請加入個人 API Path
 
const app = createApp({
    data() {
        return {
            user: {
                username: '',
                password: '',
            },
            hintMessage:'',
        }
    },
    methods: {
        login() {
            const api = `${url}/admin/signin`;
            axios.post(api, this.user).then((response) => {
                console.log(response.data);
                // 寫入 cookie token
                // expires 設置有效時間
                if(response.data.success){
                this.hintAlert = '0';
                const {token, expired} = response.data;
                document.cookie = `cakeToken=${token}; expires=${new Date(expired)};`;
                parent.window.location.replace('./products.html');
            }
            }).catch((error) => {
                // alert(error.data.message);
                this.hintMessage = '1';
            });
        },
    },
})

app.mount('#app');