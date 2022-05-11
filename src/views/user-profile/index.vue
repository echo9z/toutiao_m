<!--
* @description 编辑用户资料
* @fileName index.vue
* @author echo9z
* @date 2022/05/09 19:34:08
!-->
<template>
  <div class="user-profile">
    <!-- 通过原生的input文本框 
      accept="image/*" 直接收image 上次的图片
    -->
    <input type="file" hidden ref="fileRef" accept="image/*" @change="onChange" />
    <van-nav-bar
      title="个人信息"
      left-arrow 
      @click-left="$router.back()" /> 
    <van-cell title="头像" center >
      <!-- 右侧小图标
        @click="$refs.fileRef.click()" 处理上传图片逻辑-->
      <van-icon 
        class="photo-arrow"
        @click="$refs.fileRef.click()"
        slot="right-icon"
        name="arrow"
      ></van-icon>

      <van-image
        width="45"
        height="45"
        fit="cover"
        round
        :src="user.photo"
        @click="previewAvatar"
      />
    </van-cell>
    <van-cell 
      title="昵称" 
      is-link 
      :value='user.name' 
      @click="isEditNameShow=true"></van-cell>
    <van-cell 
      title="性别" 
      is-link 
      :value="user.gender ? '女':'男'" 
      @click="isEditGenderShow=true"></van-cell>
    <van-cell 
      title="生日" 
      is-link 
      :value="user.birthday"
      @click="isBirthdayShow=true"></van-cell>

    <!-- 编辑昵称弹出层 -->
    <van-popup 
      v-model="isEditNameShow"
      class="popup-name"
      round
      :style="{ width:'80%' }">
      <!-- 昵称 
        当传递子组件的数据既要使用又要修改，比如这里的name
        在这种情况下我们可以使用v-model简写
        :username="user.name"
        @success-name="user.name = $event"
        上面两个代码可以简写为 v-model="user.name"
        -->
      <!-- <update-name 
        :username="user.name"
        @success-name="user.name = $event"
        @close="isEditNameShow=false" /> --> 
      <!-- v-model="user.name"
            默认传递一个名字为value的数据，不需要再取一个像:username="user.name"进行传值
            默认:value="user.name"
            同时默认监听input事件 @input="user.name = $event"
            v-model的本质上还是父子组件通信，简化了父组件的使用，原来要写两句代码记得传值，也得监听事件获取值 -->

      <!-- 同时在一个组件中只能使用一个v-model -->

      <!-- 如果有多个数据需要保持同步，使用sync修饰符
          比如，需要再同步gender属性，一般写法是
          :gender="user.gender"
          @update-gender="user.gender = $event"

          通过修饰符.sync
          :gender.sync="user.gender" 相当于
            :gender="user.gender"
            还会监听事件 @update:gender="user.gender = $event";子父组件触发事件emit('update:gender',1)
      -->

      <update-name 
        v-if="isEditNameShow"
        v-model="user.name"
        @close="isEditNameShow=false"
      />
    </van-popup>

    <!-- 编辑性别 -->
    <van-popup 
      v-model="isEditGenderShow"
      class="popup-gender"
      position="bottom"
      round
      >
      <update-gender
        v-model="user.gender"
        @close="isEditGenderShow=false" />
    </van-popup>

    <!-- 修改生日 -->
    <van-popup 
      v-model="isBirthdayShow"
      class="popup-gender"
      position="bottom"
      round
      >
      <update-birthday
        v-if="isBirthdayShow"
        v-model="user.birthday"
        @close="isBirthdayShow=false" />
    </van-popup>

    <!-- 修改头像 -->
    <van-popup 
      v-model="isPhotoShow"
      class="popup-photo"
      position="bottom"
      round
      style="height:100%"
      >
      <update-photo
        v-if="isPhotoShow"
        :image="files"
        @close="isPhotoShow=false"
        @update-photo="user.photo =$event"
        />
    </van-popup>
  </div>
</template>

<script>
import {getUserProfile} from '@/api/user'
import UpdateName from './components/update-name.vue'
import UpdateGender from './components/update-gender.vue'
import UpdateBirthday from './components/update-birthday.vue'
import UpdatePhoto from './components/update-photo.vue'

export default {
  name: 'UserProfile',

  data () {
    return {
      user:{},
      isEditNameShow:false, // 展示编辑名称的显示状态
      isEditGenderShow:false, // 展示编辑性别的显示状态
      isBirthdayShow:false, // 展示编辑生日的显示状态
      isPhotoShow:false, // 展示编辑头像的显示状态
      // fileInputImage: null // 存放上传的图片
      files: null // 存放上传的图片 的文件对象
    }
  },

  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },

  props: {},

  computed: {},

  created() {
    this.loadUserProfile()
  },

  //mounted: {},

  watch: {},

  methods: {
    // 加载用户资料
    async loadUserProfile(){
      const {data:res} = await getUserProfile()
      this.user = res.data
      console.log('用户资料',res);
    },
    // 图片文本框发送改变时触发函数
    onChange(){
      // 在弹出层预览图片
      // const blob = window.URL.createObjectURL(this.$refs.fileRef.files[0]) // 通过createObjectURL方法返回一个blob数据
      // console.log(blob);
      const files = this.$refs.fileRef.files[0] // 通过createObjectURL方法返回一个blob数据
      this.files = files

      // 显示弹出层
      this.isPhotoShow = true

      // 为了解决上传相同文件，出触发onChange事件，手动的将file对象的value值给清空
      console.dir(this.$refs.fileRef);
      this.$refs.fileRef.value = '' // 请求值
    },
    // 头像预览
    previewAvatar(){
      this.$imgPreview([this.user.photo]);
    }
  }
}

</script>
<style lang='less' scoped>
.user-profile {
  .popup-name {
    top: 40%;
  }
  .popup-photo{ // 图片弹出层
    background-color: #000;
    // 让裁切区域
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .photo-arrow{ //头像 右侧小图标
    height: 24px;
    line-height: 24px;
    font-size: 16px;
    margin-left: 4px;
    color: #969799;
  }
}

</style>