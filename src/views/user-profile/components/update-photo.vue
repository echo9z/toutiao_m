<!--
* @description 修改用户头像
* @fileName update-photo.vue
* @author echo9z
* @date 2022/05/10 20:14:14
!-->
<template>
  <div class="update-photo">
    <img :src="img" alt="" class="img"  ref="imgRef">
    <van-nav-bar
      class="handel-photo"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm" /> 
  </div>
</template>

<script>
import Cropper from 'cropperjs'; // 第三方裁切库
import 'cropperjs/dist/cropper.css'; // 裁切泪样式
import {updateUserPhoto} from '@/api/user'

export default {
  name: 'UpdatePhoto',

  data () {
    return {
      img: window.URL.createObjectURL(this.image), 
      cropper: null // 图片裁切的实例对象
    }
  },

  components: {
  },

  props: {
    image:{ // 通过user-profile，通过input文本框上传的图片，获取dom获得的file对象
      type: File,
      required: true
    }
  },

  computed: {},

  created() {
    
  },

  mounted() {
    // 获取需要裁切的图片DOM
    const image = this.$refs.imgRef;

    // 如果cropper对象存在，则将下一次用户上传图片
    // if(this.cropper){
    //   this.cropper.replace(window.URL.createObjectURL(value)) // 销毁
    //   return 
    // }
    // 第一次初始化，如果预览裁切的图片发生了改变，裁切器默认不会更新
    this.cropper = new Cropper(image, {
      viewMode: 1, //限制裁剪框不超过画布的大小，即不能移动出图片意外区域
      dragMode: 'move', //移动画布 即移动图片
      aspectRatio: 1, // 裁剪框的固定纵横比，比如 1：1
      // autoCropArea: 1, // 定义自动裁剪区域大小，裁剪出大小100%
      cropBoxMovable: true, // 允许拖动裁剪框
      cropBoxResizable: false, //允许调整裁剪框的大小
      background: false, //显示容器的网格背景
      movable: true //启用图片移动图像
    })
    // console.log(cropper);
  },

  watch: {
  },

  methods: {
    async onConfirm(){
      this.$message.loading({
        message: '保存中...',
        forbidClick: true, //禁止背景点击
        duration: 0 // 展示时长(ms)，值为 0 时，toast一直展示，默认是2000
      });
      
      try {
        const file = await this.getCroppedCanvas() //返回一个file对象
        // 如果是Content-Type 数据格式为：application/x-www-form-urlencoded，则必须提交的是FormData数据对象，专门用于上次文件的
        let formData = new FormData()
        // formData.append('photo',this.image)
        formData.append('photo', file)
        const {data:res} = await updateUserPhoto(formData)

        if(res.message === 'OK'){
          // 修改父组件中头像数据 user.photo
          this.$emit('update-photo', window.URL.createObjectURL(file)) 
          this.$message.success('修改头像成功')
        }
        // 退出弹出层
        this.$emit('close')
        
      } catch (error) {
        console.log(error)
      }
    },
    getCroppedCanvas(){
      // 这里使用Promise原因是，要写到不同写在toBlob的回调函数获得 blob对象
      // this.cropper.getCroppedCanvas().toBlob((blob) => {
      //   resolve(blob)
      // })
      return new Promise(resolve => {
        // 通过 cropperjs中getCroppedCanvas函数.toBlob()返回blob裁切的 file对象
        this.cropper.getCroppedCanvas().toBlob((file) => {
          console.log('f',file);
          resolve(file)
        })
      })
    },
  }
}

</script>
<style lang='less' scoped>
.update-photo{

  /* Ensure the size of the image fit the container perfectly */
  .img {
    display: block;
    /* This rule is very important, please don't ignore this */
    max-width: 100%;
  }
  .handel-photo{ // 底部导航取消 与 完成
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background: #000;
    /deep/.van-nav-bar__text{
      color: #fff
    }
  }
}
</style>