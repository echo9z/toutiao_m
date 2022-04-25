/**
 * PostCss 配置文件
 * PostCss 是基于Node.js运行的一个处理css的工具，所以它的配置文件也是运作在Node.js中
 */

// 通过module.exports 对外暴露出一个配置对象
module.exports = {
    // 配置要使用的相关插件
    plugins: {
        // 自动添加浏览器厂商声明前缀，兼容不同的浏览器
        // vue-cli中配置了autoprefixer，所以不需要添加
        // autoprefixer:{
        //      // browsers 用来配置兼容的系统或浏览器环境
        //      // 这个配置存在问题，写在这里会有控制台的编译警告
        //      //为什么？因为VueCLI是 通过项目中 .browserslistrc 文件来配置要兼容的环境信息，需要写在.browserslistrc文件中
        //     browsers:['Android >= 4.0','iOS >= 8']
        // },
        // 将px 转为 rem
        'postcss-pxtorem': {
            // 转换根元素基准值，html字体的大小
            // 正常情况下按照设计稿来，比如750宽的设计稿比如划分10等份，750/10=75；375宽的设计稿，375/10=37.5
            // Vant组件库是基于375宽度写的，移动端页面一般都是iphone6/7/8写的
            // Vant组件是基于375的逻辑像素写的
            // 比如本项目中的设计稿给予物理像素750宽度摄设计的，如果html的基准值为75，
            // 那么在ps工具中测量得到的多少就写多少，但Vant是样式会小一半，原因是Vant是37.5，小了一半；比如50px，但Vant中组件会缩小一半显示为25px，就会感觉变小；
            // 所以我们必须设置为37.5的基准值，但是在测量时设计稿大小 需要将测量得到数据 / 2，比如测量得到50px，写在项目中为25px
            rootValue: 37.5,
            //需要转换的css属性，*表示所有属性都需要转换将px转为rem 
            // propList: ['font-size']，只转换font-size:37.5px 转换为 1rem
            propList: ['*'],
        },
    },
};