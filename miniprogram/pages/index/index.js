const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    animal:[],
    typeItems:['物种','性别'],
    typeCurrentIndex:0,
    chooseItems:{
      0:[{
        name:'猫',
        value:'cat',
        selected:false
      },{
        name:'狗',
        value:'dog',
        selected:false
      },{
        name:'其他',
        value:'other',
        selected:false
      }
    ],
    1:[{
      name:'雄',
      value:'male',
      selected:false
    },{
      name:'雌',
      value:'female',
      selected:false
    }]
    },
    region:"",
    species:"",
    sex:""
  },
  toDetail(e){
    // console.log(e)
    
    wx.reLaunch({
      url: `/pages/detail/detail?id=${e.currentTarget.id}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this
    db.collection('test').where({
      isApproval:true
    }).get({
      success: function(res) {
        // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
        // console.log(res)
        that.setData({
          animal:res.data,
        })
        // console.log(that.data.animal)
      }
    })
  },
  //筛选
  //下拉收回
  sreenShow:function(){
    this.setData({
      sreenShow:!this.data.sreenShow
    })
  },
  cancel:function(){
    this.setData({
      sreenShow:false
    })
  },
  //清空选择
  clear:function(){
    // console.log("clear已调用")
    for(var i=0,t=1000;i<t;i++){
      if(this.data.chooseItems[i]==null){
        break;
      }
      for(var m=0,n=1000;m<n;m++){
        if(this.data.chooseItems[i][m]==null){
          break;
        }
        this.data.chooseItems[i][m].selected=false
      }
    }
    this.setData({
      chooseItems:this.data.chooseItems,
      region:""
    })
  },
  //确认筛选
  confirm:function(){
    let that = this
    that.setData({
      species:"",
      sreenShow:false,
      sex:""
    })
    for(var i=0,t=1000;i<t;i++){
      if(that.data.chooseItems[i]==null){
        break;
      }
      for(var m=0,n=1000;m<n;m++){
        if(that.data.chooseItems[i][m]==null){
          break;
        }
        if(that.data.chooseItems[i][m].selected==true){
          if(i==0){
            that.setData({
              species:that.data.chooseItems[i][m].value //设置
            })
          }else if(i==1)(
            that.setData({
              sex:that.data.chooseItems[i][m].value
            })
          )
        }
      }
    }
    console.log(that.data.species)
    console.log(that.data.sex)
    //从数据库中筛选
    db.collection('test').where({
      isApproval:true,
      species:that.data.species,
      sex:that.data.sex,
      region:that.data.region
    }).get({
      success: function(res) {
        // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
        // console.log("数据库查询结果:")
        // console.log(res)
        that.setData({
          animal:res.data,
        })
        // console.log(that.data.animal)
        // console.log("找到的结果")
        // console.log(that.data.animal)
      }
    })
    if(that.data.species==""&&that.data.sex==""){
      wx.reLaunch({
        url: '../index/index',
      })
    }
  },
  sortShow:function(){
    this.setData({
      sortShow:!this.data.sortShow
    })
  },
  //点击遮罩层
  mask:function(){
    this.setData({
      sreenShow:false,
      sortShow:false
    })
  },
  //选择类型
  chooseType:function(e){
    const{index}=e.currentTarget.dataset;
    console.log(index);
    this.setData({
      typeCurrentIndex:index,
    })
  },
  //选择具体内容
  chooseItem:function(e){
    console.log("输出的"+e.target.dataset.index)
    for(var i=0;i<100;i++){
      if(this.data.chooseItems[this.data.typeCurrentIndex][i]==null){
        break;
      }
      if(i!=e.target.dataset.index){
        this.data.chooseItems[this.data.typeCurrentIndex][i].selected=false
        // console.log(this.data.chooseItems[this.data.typeCurrentIndex][i])
      }
    }
    this.data.chooseItems[this.data.typeCurrentIndex][e.target.dataset.index].selected=!this.data.chooseItems[this.data.typeCurrentIndex][e.target.dataset.index].selected
    this.setData({
      chooseItems:this.data.chooseItems
    })
  },
  getUserProvince:function(e)
  {
     this.setData({
         region:e.detail.value     //将用户选择的省市区赋值给region
     })
  },
})
