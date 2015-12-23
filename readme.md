#图片截图上传插件
该组件结合WebUploader文件上传插件和jQuery Jcrop插件实现图片预览、拖动剪裁、实时上传的功能。

- **webUploader：**[http://fex.baidu.com/webuploader/][1]
- **jQuery Jcrop：**[http://deepliquid.com/content/Jcrop.html][2]
##兼容性
- ie6+
- ALL

  [1]: http://fex.baidu.com/webuploader/
  [2]: http://deepliquid.com/content/Jcrop.html
  
##组件相关文件介绍
- 样式文件
 - jquery.Jcrop.css ：裁剪样式文件
 - pic-clip.css ：主要样式文件
- js文件
 - jquery-1.9.1.min.js ：组件依赖文件
 - reveal-model.js ：弹出框js文件
 - webuploader.js ：图片上传js文件
 - jquery.Jcrop.js ：图片拖动裁剪js文件
 - mod-Picture.js ：图片裁剪上传配置js文件
 - tab.exam.js ：tab切换js文件
-  flash
 - Uploader.swf  ：主流IE浏览器Flash文件上传
- server 文件传输服务端文件夹

##组件使用

###1、页面文件引用

- css文件引用
```
<link  href="style/jquery.Jcrop.css" rel="stylesheet" type="text/css" />
<link  href="style/pic-clip.css" rel="stylesheet" type="text/css" />
```
- js文件引用
```
<script src="javascript/webuploader.js" type="text/javascript"></script>
<script  src="javascript/jquery.Jcrop.js" type="text/javascript" ></script>
<script  src="javascript/modPicture2.js" type="text/javascript" ></script>
<script src="javascript/tab.exam.js" type="text/javascript" ></script>
<script src="javascript/reveal-model.js"></script>
```
###2、demo中html代码结构示例
- 页面主体区域的html代码结构
```

<div class="more-preview-pic">
            <div class="large-6 columns small-12">
                <div class="crop crop1" id="crop1">
                    <div class="crop-img click-block" reveal-model-id="pic-clip1"><img src="images/default.png"  alt=""/></div>
                </div>
            </div>
            <div class="large-5 columns small-12">
                <div class="clearfix"> <a href="javascript:void(0);" reveal-model-id="pic-clip1" class="click-block uploader-bn button"><i class="fa fa-upload"></i>上传</a> </div>
                <div class="nor-method">
                    <p>
                        温馨提醒： <br/>
                        可以点击上传或者图片窗口选择图片和参考海报！
                    </p>
 <p>一张漂亮的海报，能让你的活动锦上添花，带来更多用户报名
                        及增加传播效果，也将影响该活动被推广的几率！</p>
                </div>
            </div>
</div>
```
- 模态弹出框中的html代码结构
```
 <div class=" row-upload" >
        <div class="box-content" id="pic-clip1">
            <h2>海报设置<a href="#" class="close-reveal-modal">×</a></h2>
            <!--tab切换-->
            <div class="tab-rec-1">
                <div class="tab clearfix no-margin">
                    <ul class="clearfix" id="datatable_pic">
                        <li class="on"> <a href="#" target="_blank">本地上传</a> </li>
                        <li> <a href="#" target="_blank">海报参考</a> </li>
                    </ul>
                </div>
                <div class="modcon clearfix ">
                    <div id="post_dttab_con_1" class="clearfix">
                        <div class="modPic" id="modPic">
                            <input type="hidden" name="act" id="act" value="uploadAndCutImg">
                            <input type="hidden" id="x" name="x">
                            <input type="hidden" id="y" name="y">
                            <input type="hidden" id="w" name="w">
                            <input type="hidden" id="h" name="h">
                            <input name="caseId" id="caseId" value="00000015" type="hidden">
                            <input name="appId" value="00000001" type="hidden">
                            <div class="uploader-area " id="filePicker">点击选择图片</div>
                            <span>只支持JPG、PNG、GIF，大小不超过2M</span> <span class="up-span-pic"></span>
                            <p>可将图片拖至这里</p>
                            <div class="uploader-list" id="fileList"></div>
                        </div>
                        <div class="btn-grop clearfix"> <a class="reveal-button right sure clip-success-btn close-reveal-modal" style="display:none;" >确定</a> <a class="reveal-button close-reveal-modal right margin-r10" aria-label="Close">取消</a> <a class="" id="filePicker2" style="display:none;">重新上传</a> </div>
                    </div>
                    <div id="post_dttab_con_2" style="display:none;">
                        <div class="picture-select-box">
                            <ul class="clearfix">
                                <li><img src="images/poster/a1_preview.jpg" real-src="images/poster/a1.jpg" alt="创业"/><span>创业</span><i></i></li>
                               ...
                                <li><img src="images/poster/a14_preview.jpg" real-src="images/poster/a14.jpg" alt="运动"/><span>运动</span><i></i></li>
                            </ul>
                        </div>
                        <div class="btn-grop clearfix"> <a class="reveal-button right sure select-success-btn close-reveal-modal" style="display:none;">确定</a> <a class="reveal-button close-reveal-modal right margin-r10" aria-label="Close">取消</a> </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
```
##配置文件中相关参数说明

-  文件接收服务端

	uploader.option('`server`', 'http://192.168.4.211:8080/fileCenter/fileUpload.sp?act=uploadSave&appId=00000001&caseId=00000018');

- 图片最大剪裁区域、缩放比例
```
jcp = $.Jcrop('#modPic .uploader-list img',{
	minSize: [100, 100],//剪裁最小长宽值（未设定则默认为值为[1,1]）
	maxSize: [680, 380], //剪裁最大长宽值
	aspectRatio: 1.7894  //剪裁框缩放比例
})
```

-  图片导入后默认裁剪显示位置、大小

```
jcp.setSelect([0, 0, 420, 250]); //相对于导入的图片，裁剪位置x/y坐标为0/0，长宽为420/250
```
- 图片拖入上传区域
```
dnd: '#modPic',//拖入上传的容器，未配置则不启用
```

##更新日志
- 实现图片预览、裁剪上传，兼容ie+， 所有主流浏览器。  ---2015年12月23日 


