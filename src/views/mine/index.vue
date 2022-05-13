<!--
* @description 我的组件
* @fileName index.vue
* @author echo9z
* @date 2022/04/25 14:48:40
!-->
<template>
  <div class="mine-container">
    <div class="userInfo">
      <!-- 已登录的状态 -->
      <van-cell-group v-if="user" class="my-info">
      <!-- 第一行cell 包括头像 昵称 编辑资料 -->
        <van-cell class="base-info" center :border="false" >
          <template v-slot:icon>
            <div>
              <!-- 头像组件
              fit：图片的填充模式 具体看文档 -->
              <van-image
                class="avatar"
                fit="cover"
                round
                :src="currentUser.photo"
                @click="previewAvatar"
              />
            </div>
          </template>
          <!-- 昵称 -->
          <template v-slot:title>
            <div class="name">{{currentUser.name}}</div>
          </template>
          <!-- 编辑资料 -->
          <van-button round size="small" class="update-btn" :key="currentUser.id" to="/user/profile" >编辑资料</van-button>
        </van-cell>

      <!-- 头条 关注 粉丝 获赞 -->
      <!-- border取消边框 -->
        <van-grid class="data-info" :border="false">
          <van-grid-item class="data-info-item">
            <template v-slot:text>
              <div class="count">{{currentUser.art_count}}</div>
              <div class="text">头条</div>
            </template>
          </van-grid-item>
          <van-grid-item class="data-info-item">
            <template v-slot:text>
              <div class="count">{{ currentUser.follow_count	}}</div>
              <div class="text">关注</div>
            </template>
          </van-grid-item>
          <van-grid-item class="data-info-item">
            <template v-slot:text>
              <div class="count">{{currentUser.fans_count}}</div>
              <div class="text">粉丝</div>
            </template>
          </van-grid-item>
          <van-grid-item class="data-info-item">
            <template v-slot:text>
              <div class="count">{{ currentUser.like_count }}</div>
              <div class="text">获赞</div>
            </template>
          </van-grid-item>
        </van-grid>
      </van-cell-group>

      <!-- 未登录的结构 -->
      <div v-else class="not-login">
        <div @click="$router.push('/login')">
          <img src="./nologout.png" alt="">
        </div>
        <div>
          <span class="text">登录/注册</span>
        </div>
      </div>

    <!-- 收藏 历史 网格组件grid -->
      <van-grid class="nav-grid mb-4" :column-num="2">
        <van-grid-item class="nav-grid-item" icon-prefix="toutiao" icon="shoucang" text="收藏" />
        <van-grid-item class="nav-grid-item" icon-prefix="toutiao" icon="lishi" text="历史" />
      </van-grid>

    <!-- 可以通过 url 属性进行 URL 跳转，或通过 to 属性进行路由跳转。 
        is-link:展示右边的箭头-->
      <van-cell title="消息通知" is-link to="/" />
      <van-cell title="echo同学" class="mb-4" is-link to="/user/chat" />

      <van-cell v-if="user" :column-num="1" center class="logout" >
        <van-button block @click="onLogout" >退出登录</van-button>
      </van-cell>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getCurrentUser } from '@/api/user'

export default {
  name: 'mine',

  data () {
    return {
      // 当前用户登录信息
      currentUser:{}
    }
  },

  components: {},

  props: {},

  computed: {
    ...mapState(['user'])
  },

  created() {
      this.getUserInfo()
  },

  //mounted: {},

  methods: {
    //确认退出
    onLogout(){
      //提示用户确认退出
      this.$dialog.confirm({
        title: '提示退出',
        message: '确认退出吗？',
      }).then(() => { //确认
        // 请处登录状态
        this.$store.commit('removeUser')
      }).catch(() => { //退出
        // on cancel
      });
    },
    //根据用户token 获取个人信息
    async getUserInfo(){
      if(this.user){
        const {data:res} = await getCurrentUser()
        console.log(res);
        this.currentUser = res.data
      }
    },
    // 头像预览
    previewAvatar(){
      this.$imgPreview([this.currentUser.photo]);
    }
  }
}

</script>
<style lang='less' scoped>
.mine-container{
  // 头像 昵称 编辑
  .my-info{
    background: url('./banner.png') no-repeat;
    background-size: cover;
    .base-info{
      box-sizing: border-box; /* 让那边叫都计算在宽高中 */
      background-color: unset;
      height: 115px;
      padding-top: 38px;
      padding-bottom: 11px;
      .avatar{
        box-sizing: border-box;
        width: 66px;
        height: 66px;
        border: 1px solid #fff;
        margin-right: 12px;
      }
      .name{
        color:#fff;
        font-size: 15px;
      }
      .update-btn{
        height: 18px;
        font-size: 10px;
        color: #666;
      }
    }
    // 头条 关注 粉丝 获赞
    .data-info{
      .data-info-item{
        height: 65px;
        color: #fff;
        .count{
          font-size: 18px;
        }
        .text{
          font-size: 11px;
        }
      }
    }
    /deep/ .van-grid-item__content{
      background-color: unset; //隐藏grid的背景颜色
    }
  }

  //未登录
  .not-login{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 180px;
    background: url('./banner.png') no-repeat;
    background-size: cover;
    img{
      width: 66px;
      height: 66px;
    }
    .text{
      font-size: 14px;
      color: #fff
    }
  }

  // 收藏 历史
  /deep/.nav-grid{
    .nav-grid-item{
      height: 70px;
      .toutiao{
        font-size: 22px;
      }
      .toutiao-shoucang {
        color:#eb5253
      }
      .toutiao-lishi {
        color:#ff9d1d
      }
      .van-grid-item__text{
        font-size: 14px;
        color: #333;
      }
    }
  }

  //退出登录
  .logout{
    height: 50px;
    .van-button--default {
      border: 0;
      .van-button__text{
        color:#d86262;
        font-size: 14px;
      }
    }
  }
  .mb-4{
    margin-bottom: 4px;
  }
}
</style>