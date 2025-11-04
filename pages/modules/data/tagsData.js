// 标签数据模块
export const tagsData = {
  // 生成标签HTML
  generateTagsHTML() {
    return `
    <div class="search-container">
        <input type="text" id="tagSearchInput" placeholder="搜索标签..." class="tag-search-input">
        <img id="clearSearchBtn" src="../images/cross-circle.png" alt="清空搜索" class="clear-search-img" title="清空搜索">
      </div>
    <div class="tags-nav">
          <span class="nav-item active" data-category="常规标签">常规标签</span>
          <span class="nav-item" data-category="艺术题材">艺术题材</span>
          <span class="nav-item" data-category="人物类">人物类</span>
          <span class="nav-item" data-category="场景">场景</span>
          <span class="nav-item" data-category="已添加">已添加</span>
        </div>
     <!-- 标签内容区域 -->
        <div class="tags-content">
          <!-- 常规标签 -->
          <div class="tags-category-content active" id="常规标签">
            <!-- 画质 -->
            <div class="tags-category">
              <div class="category-title">画质</div>
              <div class="tags-container" id="qualityTags">
                <span class="tag" data-value="杰作">杰作</span>
                <span class="tag" data-value="写实">写实</span>
                <span class="tag" data-value="提高质量">提高质量</span>
                <span class="tag" data-value="最佳质量">最佳质量</span>
                <span class="tag" data-value="高分辨率">高分辨率</span>
                <span class="tag" data-value="超高分辨率">超高分辨率</span>
                <span class="tag" data-value="超清晰">超清晰</span>
                <span class="tag" data-value="更多细节">更多细节</span>
                <span class="tag" data-value="简单背景">简单背景</span>
                <span class="tag" data-value="模糊背景">模糊背景</span>
                <span class="tag" data-value="清晰背景">清晰背景</span>
                <span class="tag" data-value="清晰细节">清晰细节</span>
                <span class="tag" data-value="超精细绘画">超精细绘画</span>
                <span class="tag" data-value="聚焦清晰">聚焦清晰</span>
                <span class="tag" data-value="物理渲染">物理渲染</span>
                <span class="tag" data-value="极详细绘画">极详细绘画</span>
                <span class="tag" data-value="改良细节">改良细节</span>
                <span class="tag" data-value="添加鲜艳色彩">添加鲜艳色彩</span>
                <span class="tag" data-value="扫描">扫描</span>
              </div>
            </div>
            
            <!-- 摄影 -->
            <div class="tags-category">
              <div class="category-title">摄影</div>
              <div class="tags-container" id="photoTags">
                <span class="tag" data-value="使用相机EOS R8,50mm,F1.2,8K,RAW photo">相机设置</span>
                <span class="tag" data-value="散景">散景</span>
                <span class="tag" data-value="景深">景深</span>
                <span class="tag" data-value="广角">广角</span>
                <span class="tag" data-value="微距">微距</span>
                <span class="tag" data-value="大光圈">大光圈</span>
              </div>
            </div>
            

            
            <!-- 光影 -->
            <div class="tags-category">
              <div class="category-title">光影</div>
              <div class="tags-container" id="lightingTags">
                <span class="tag" data-value="漫溢室灯光">漫溢室灯光</span>
                <span class="tag" data-value="电影光效">电影光效</span>
                <span class="tag" data-value="镜头光晕">镜头光晕</span>
                <span class="tag" data-value="光追">光追</span>
                <span class="tag" data-value="正面光">正面光</span>
                <span class="tag" data-value="侧面光">侧面光</span>
                <span class="tag" data-value="背光">背光</span>
                <span class="tag" data-value="逆光">逆光</span>
                <span class="tag" data-value="边缘光">边缘光</span>
                <span class="tag" data-value="强边缘光">强边缘光</span>
                <span class="tag" data-value="自上而下的光线">自上而下的光线</span>
                <span class="tag" data-value="明亮的环线光束">明亮的环线光束</span>
                <span class="tag" data-value="环境光">环境光</span>
                <span class="tag" data-value="轮廓光">轮廓光</span>
                <span class="tag" data-value="休闲光">休闲光</span>
                <span class="tag" data-value="聚光灯">聚光灯</span>
                <span class="tag" data-value="透镜光晕">透镜光晕</span>
                <span class="tag" data-value="金属光泽">金属光泽</span>
                <span class="tag" data-value="氛围光照">氛围光照</span>
                <span class="tag" data-value="丁达尔效应">丁达尔效应</span>
                <span class="tag" data-value="漫光效果">漫光效果</span>
                <span class="tag" data-value="背景光">背景光</span>
                <span class="tag" data-value="自然光">自然光</span>
              </div>
            </div>
            
            <!-- 构图 -->
            <div class="tags-category">
              <div class="category-title">构图</div>
              <div class="tags-container" id="compositionTags">
                <span class="tag" data-value="全身">全身</span>
                <span class="tag" data-value="半身像">半身像</span>
                <span class="tag" data-value="上半身">上半身</span>
                <span class="tag" data-value="正面视角">正面视角</span>
                <span class="tag" data-value="侧面视角">侧面视角</span>
                <span class="tag" data-value="从上方往下看">从上方往下看</span>
                <span class="tag" data-value="从下方往上看">从下方往上看</span>
                <span class="tag" data-value="左侧">左侧</span>
                <span class="tag" data-value="右侧">右侧</span>
                <span class="tag" data-value="动态角度">动态角度</span>
                <span class="tag" data-value="倾斜视角">倾斜视角</span>
                <span class="tag" data-value="特写">特写</span>
                <span class="tag" data-value="微距">微距</span>
                <span class="tag" data-value="近景">近景</span>
                <span class="tag" data-value="中景">中景</span>
                <span class="tag" data-value="中长镜头">中长镜头</span>
                <span class="tag" data-value="远景">远景</span>
                <span class="tag" data-value="全景">全景</span>
                <span class="tag" data-value="近拍">近拍</span>
                <span class="tag" data-value="俯视">俯视</span>
                <span class="tag" data-value="鸟瞰">鸟瞰</span>
                <span class="tag" data-value="鱼眼镜头">鱼眼镜头</span>
                <span class="tag" data-value="多视角分解">多视角分解</span>
                <span class="tag" data-value="俯底视角">俯底视角</span>
              </div>
            </div>
          </div>
          
          <!-- 艺术题材 -->
          <div class="tags-category-content" id="艺术题材">
            <div class="tags-category">
              <div class="category-title">表现形式</div>
              <div class="tags-container" id="expressionFormTags">
                <span class="tag" data-value="动漫">动漫</span>
                <span class="tag" data-value="Q版">Q版</span>
                <span class="tag" data-value="摄影">摄影</span>
                <span class="tag" data-value="数字艺术">数字艺术</span>
                <span class="tag" data-value="达芬奇画">达芬奇画</span>
                <span class="tag" data-value="四格漫画">四格漫画</span>
                <span class="tag" data-value="幻想艺术">幻想艺术</span>
              </div>
            </div>
            
            <div class="tags-category">
              <div class="category-title">绘画技法</div>
              <div class="tags-container" id="paintingTechniqueTags">
                <span class="tag" data-value="素描">素描</span>
                <span class="tag" data-value="漫画">漫画</span>
                <span class="tag" data-value="厚涂">厚涂</span>
                <span class="tag" data-value="油画">油画</span>
                <span class="tag" data-value="水彩">水彩</span>
                <span class="tag" data-value="国风水墨">国风水墨</span>
                <span class="tag" data-value="蜡笔">蜡笔</span>
                <span class="tag" data-value="马克笔">马克笔</span>
                <span class="tag" data-value="超写实">超写实</span>
              </div>
            </div>
            
            <div class="tags-category">
              <div class="category-title">技术风格</div>
              <div class="tags-container" id="technicalStyleTags">
                <span class="tag" data-value="像素艺术">像素艺术</span>
                <span class="tag" data-value="低多边形">低多边形</span>
                <span class="tag" data-value="等距艺术">等距艺术</span>
                <span class="tag" data-value="线条艺术">线条艺术</span>
                <span class="tag" data-value="故障艺术">故障艺术</span>
                <span class="tag" data-value="气泡艺术">气泡艺术</span>
                <span class="tag" data-value="玻璃拟态">玻璃拟态</span>
                <span class="tag" data-value="新拟物风格">新拟物风格</span>
                <span class="tag" data-value="3D插画">3D插画</span>
              </div>
            </div>
            
            <div class="tags-category">
              <div class="category-title">艺术家风格</div>
              <div class="tags-container" id="artistStyleTags">
                <span class="tag" data-value="宫崎骏风格">宫崎骏风格</span>
                <span class="tag" data-value="蒂姆伯顿风格">蒂姆伯顿风格</span>
              </div>
            </div>
            
            <div class="tags-category">
              <div class="category-title">艺术流派</div>
              <div class="tags-container" id="artSchoolTags">
                <span class="tag" data-value="美福明亮">美福明亮</span>
                <span class="tag" data-value="赛博朋克">赛博朋克</span>
                <span class="tag" data-value="蒸汽波">蒸汽波</span>
                <span class="tag" data-value="迷幻艺术">迷幻艺术</span>
                <span class="tag" data-value="酸性风格">酸性风格</span>
                <span class="tag" data-value="极简主义">极简主义</span>
                <span class="tag" data-value="构成主义">构成主义</span>
                <span class="tag" data-value="孟菲斯风格">孟菲斯风格</span>
              </div>
            </div>
            
            <div class="tags-category">
              <div class="category-title">媒介与效果</div>
              <div class="tags-container" id="mediaEffectsTags">
                <span class="tag" data-value="胶片滤镜">胶片滤镜</span>
                <span class="tag" data-value="电影质感">电影质感</span>
                <span class="tag" data-value="胶片电影">胶片电影</span>
                <span class="tag" data-value="复古风格">复古风格</span>
              </div>
            </div>
            
            <div class="tags-category">
              <div class="category-title">载体与应用</div>
              <div class="tags-container" id="applicationTags">
                <span class="tag" data-value="杂志封面">杂志封面</span>
                <span class="tag" data-value="海报">海报</span>
                <span class="tag" data-value="拍立得">招立牌</span>
              </div>
            </div>
          </div>
          
          <!-- 人物类 -->
          <div class="tags-category-content" id="人物类">
            <!-- 人设 -->
            <div class="tags-category">
              <div class="category-title">人设</div>
              <div class="tags-container" id="characterDesignTags">
                <div class="subcategory">
                  <div class="subcategory-title">职业</div>
                  <div class="tags-container" id="occupationTags">
                    <span class="tag" data-value="公主">公主</span>
                    <span class="tag" data-value="舞者">舞者</span>
                    <span class="tag" data-value="配送队">配送队</span>
                    <span class="tag" data-value="西装领带演员">西装领带演员</span>
                    <span class="tag" data-value="休闲队队长">休闲队队长</span>
                    <span class="tag" data-value="女服务员">女服务员</span>
                    <span class="tag" data-value="和风女仆">和风女仆</span>
                    <span class="tag" data-value="女仆">女仆</span>
                    <span class="tag" data-value="偶像">偶像</span>
                    <span class="tag" data-value="弓道">弓道</span>
                    <span class="tag" data-value="女武神">女武神</span>
                    <span class="tag" data-value="办公室小姐">办公室小姐</span>
                    <span class="tag" data-value="赛车女郎">赛车女郎</span>
                    <span class="tag" data-value="魔女">魔女</span>
                    <span class="tag" data-value="巫女">巫女</span>
                    <span class="tag" data-value="修女">修女</span>
                    <span class="tag" data-value="牧师">牧师</span>
                    <span class="tag" data-value="神职人员(基督教)">神职人员(基督教)</span>
                    <span class="tag" data-value="忍者">忍者</span>
                    <span class="tag" data-value="女警">女警</span>
                    <span class="tag" data-value="警察">警察</span>
                    <span class="tag" data-value="医生">医生</span>
                    <span class="tag" data-value="护士">护士</span>
                    <span class="tag" data-value="眼镜娘">眼镜娘</span>
                    <span class="tag" data-value="狐狸精">狐狸精</span>
                    <span class="tag" data-value="公交车">公交车</span>
                    <span class="tag" data-value="女王(SM性)">女王(SM性)</span>
                    <span class="tag" data-value="机娘">机娘</span>
                    <span class="tag" data-value="另一种机娘">另一种机娘</span>
                    <span class="tag" data-value="美人机器人">美人机器人</span>
                    <span class="tag" data-value="半机械人">半机械人</span>
                  </div>
                </div>
                
                <div class="subcategory">
                  <div class="subcategory-title">性别/年龄</div>
                  <div class="tags-container" id="genderAgeTags">
                    <span class="tag" data-value="单人">单人</span>
                    <span class="tag" data-value="女人">女人</span>
                    <span class="tag" data-value="男人">男人</span>
                    <span class="tag" data-value="性转">性转</span>
                    <span class="tag" data-value="扶她">扶她</span>
                    <span class="tag" data-value="伪娘">伪娘</span>
                    <span class="tag" data-value="儿童">儿童</span>
                    <span class="tag" data-value="未成年">未成年</span>
                    <span class="tag" data-value="年轻">年轻</span>
                    <span class="tag" data-value="熟女">熟女</span>
                    <span class="tag" data-value="老年">老年</span>
                  </div>
                </div>
                
                <div class="subcategory">
                  <div class="subcategory-title">胸部</div>
                  <div class="tags-container" id="chestTags">
                    <span class="tag" data-value="胸">胸</span>
                    <span class="tag" data-value="胸肌">胸肌</span>
                    <span class="tag" data-value="大胸肌">大胸肌</span>
                    <span class="tag" data-value="小胸部(B">小胸部(B)</span>
                    <span class="tag" data-value="中等胸部(C">中等胸部(C)</span>
                    <span class="tag" data-value="大胸部(D">大胸部(D)</span>
                    <span class="tag" data-value="巨乳(E">巨乳(E)</span>
                    <span class="tag" data-value="魔乳(F">魔乳(F)</span>
                    <span class="tag" data-value="未扣扣子">未扣扣子</span>
                  </div>
                </div>
                
                <div class="subcategory">
                  <div class="subcategory-title">脸型</div>
                  <div class="tags-container" id="faceShapeTags">
                    <span class="tag" data-value="瓜子脸">瓜子脸</span>
                        <span class="tag" data-value="猫咪脸">猫咪脸</span>
                        <span class="tag" data-value="国字脸">国字脸</span>
                        <span class="tag" data-value="可爱脸">可爱脸</span>
                        <span class="tag" data-value="美形脸">美形脸</span>
                        <span class="tag" data-value="圆脸">圆脸</span>
                        <span class="tag" data-value="长脸">长脸</span>
                        <span class="tag" data-value="鹅脸">鹅脸</span>
                        <span class="tag" data-value="平脸">平脸</span>
                        <span class="tag" data-value="柔和的脸">柔和的脸</span>
                        <span class="tag" data-value="锐角分明的脸">锐角分明的脸</span>
                  </div>
                </div>
                
                <div class="subcategory">
                  <div class="subcategory-title">鼻子</div>
                  <div class="tags-container" id="noseTags">
                    <span class="tag" data-value="蒜头鼻">蒜头鼻</span>
                        <span class="tag" data-value="肉鼻子">肉鼻子</span>
                        <span class="tag" data-value="朝天鼻">朝天鼻</span>
                        <span class="tag" data-value="扁鼻">扁鼻</span>
                        <span class="tag" data-value="鹰勾鼻">鹰勾鼻</span>
                        <span class="tag" data-value="罗马鼻">罗马鼻</span>
                        <span class="tag" data-value="狐鼻">狐鼻</span>
                        <span class="tag" data-value="长鼻">长鼻</span>
                        <span class="tag" data-value="短鼻">短鼻</span>
                  </div>
                </div>
                
                <div class="subcategory">
                  <div class="subcategory-title">嘴巴</div>
                  <div class="tags-container" id="mouthTags">
                    <span class="tag" data-value="樱桃小嘴">樱桃小嘴</span>
                        <span class="tag" data-value="心形嘴">心形嘴</span>
                        <span class="tag" data-value="薄唇">薄唇</span>
                        <span class="tag" data-value="丰唇">丰唇</span>
                        <span class="tag" data-value="嘟嘴">嘟嘴</span>
                        <span class="tag" data-value="方唇">方唇</span>
                        <span class="tag" data-value="上翘唇">上翘唇</span>
                        <span class="tag" data-value="下翘唇">下翘唇</span>
                  </div>
                </div>
                
                <div class="subcategory">
                  <div class="subcategory-title">皮肤</div>
                  <div class="tags-container" id="skinTags">
                    <span class="tag" data-value="有光泽的皮肤">有光泽的皮肤</span>
                        <span class="tag" data-value="苍白皮肤">苍白皮肤</span>
                        <span class="tag" data-value="白皙皮肤">白皙皮肤</span>
                        <span class="tag" data-value="粉色皮肤">粉色皮肤</span>
                        <span class="tag" data-value="深色皮肤">深色皮肤</span>
                        <span class="tag" data-value="健康皮肤">健康皮肤</span>
                        <span class="tag" data-value="晒日线">晒日线</span>
                        <span class="tag" data-value="冰雪肌肤">冰雪肌肤</span>
                        <span class="tag" data-value="如白色大理石般光泽的肌肤">如白色大理石般光泽的肌肤</span>
                  </div>
                </div>
                
                <div class="subcategory">
                  <div class="subcategory-title">体型</div>
                  <div class="tags-container" id="bodyTypeTags">
                    <span class="tag" data-value="模特">模特</span>
                        <span class="tag" data-value="苗条">苗条</span>
                        <span class="tag" data-value="诱惑">诱惑</span>
                        <span class="tag" data-value="丰满">丰满</span>
                        <span class="tag" data-value="肥胖">肥胖</span>
                        <span class="tag" data-value="高大">高大</span>
                        <span class="tag" data-value="纤弱">纤弱</span>
                        <span class="tag" data-value="肌肉">肌肉</span>
                        <span class="tag" data-value="细腰">细腰</span>
                        <span class="tag" data-value="宽臀">宽臀</span>
                  </div>
                </div>
                
                <div class="subcategory">
                  <div class="subcategory-title">眉毛</div>
                  <div class="tags-container" id="eyebrowTags">
                    <span class="tag" data-value="浓眉">浓眉</span>
                        <span class="tag" data-value="眉毛稀疏">眉毛稀疏</span>
                        <span class="tag" data-value="短眉毛">短眉毛</span>
                        <span class="tag" data-value="V字眉">V字眉</span>
                        <span class="tag" data-value="剑眉">剑眉</span>
                        <span class="tag" data-value="一字眉">一字眉</span>
                        <span class="tag" data-value="柳叶眉">柳叶眉</span>
                        <span class="tag" data-value="新月眉">新月眉</span>
                        <span class="tag" data-value="描画过的眉毛">描画过的眉毛</span>
                        <span class="tag" data-value="浓密而粗短的眉毛">浓密而粗短的眉毛</span>
                  </div>
                </div>
                
                <div class="subcategory">
                  <div class="subcategory-title">头发</div>
                  <div class="tags-container" id="hairTags">
                    <span class="tag" data-value="长发">长发</span>
                        <span class="tag" data-value="很短的头发">很短的头发</span>
                        <span class="tag" data-value="短发">短发</span>
                        <span class="tag" data-value="后短发，前长发">后短发，前长发</span>
                        <span class="tag" data-value="中等头发">中等头发</span>
                        <span class="tag" data-value="很长的头发">很长的头发</span>
                        <span class="tag" data-value="超级长的头发">超级长的头发</span>
                        <span class="tag" data-value="马尾">马尾</span>
                        <span class="tag" data-value="双马尾">双马尾</span>
                        <span class="tag" data-value="高双马尾">高双马尾</span>
                        <span class="tag" data-value="低双马尾">低双马尾</span>
                        <span class="tag" data-value="披肩单马尾">披肩单马尾</span>
                        <span class="tag" data-value="披肩双马尾">披肩双马尾</span>
                        <span class="tag" data-value="短马尾">短马尾</span>
                        <span class="tag" data-value="侧马尾">侧马尾</span>
                        <span class="tag" data-value="辫子">辫子</span>
                        <span class="tag" data-value="法式辫子">法式辫子</span>
                        <span class="tag" data-value="辫子头发">辫子头发</span>
                        <span class="tag" data-value="双辫子">双辫子</span>
                        <span class="tag" data-value="三股辫">三股辫</span>
                        <span class="tag" data-value="短辫子">短辫子</span>
                        <span class="tag" data-value="长辫子">长辫子</span>
                        <span class="tag" data-value="辫子刘海">辫子刘海</span>
                        <span class="tag" data-value="麻花辫">麻花辫</span>
                        <span class="tag" data-value="法式麻花辫">法式麻花辫</span>
                        <span class="tag" data-value="多股(麻花)辫">多股(麻花)辫</span>
                        <span class="tag" data-value="被在一侧的单条辫">被在一侧的单条辫</span>
                        <span class="tag" data-value="被在两侧的两条辫">被在两侧的两条辫</span>
                        <span class="tag" data-value="单股辫">单股辫</span>
                        <span class="tag" data-value="两条辫子">两条辫子</span>
                  </div>
                </div>
                
                <div class="subcategory">
                  <div class="subcategory-title">眼睛</div>
                  <div class="tags-container" id="eyeTags">
                    <span class="tag" data-value="眼袋">眼袋</span>
                        <span class="tag" data-value="缝纫面罩的单眼">缝纫面罩的单眼</span>
                        <span class="tag" data-value="迷离眼神">迷离眼神</span>
                        <span class="tag" data-value="眼罩">眼罩</span>
                        <span class="tag" data-value="眼影">眼影</span>
                        <span class="tag" data-value="医用眼罩">医用眼罩</span>
                        <span class="tag" data-value="眼睛上的疤痕">眼睛上的疤痕</span>
                        <span class="tag" data-value="闭眼">闭眼</span>
                        <span class="tag" data-value="半边双眼">半边双眼</span>
                        <span class="tag" data-value="联起眼睛">联起眼睛</span>
                        <span class="tag" data-value="拉下眼睑的视觉">拉下眼睑的视觉</span>
                        <span class="tag" data-value="睁大眼睛">睁大眼睛</span>
                        <span class="tag" data-value="一只眼睛闭着">一只眼睛闭着</span>
                        <span class="tag" data-value="蒙眼">蒙眼</span>
                        <span class="tag" data-value="眨眼">眨眼</span>
                        <span class="tag" data-value="失去高光的眼睛">失去高光的眼睛</span>
                        <span class="tag" data-value="翻白眼">翻白眼</span>
                        <span class="tag" data-value="眼泪">眼泪</span>
                        <span class="tag" data-value="锐利的眼">锐利的眼</span>
                        <span class="tag" data-value="低垂的眼">低垂的眼</span>
                        <span class="tag" data-value="上挑的眼睛">上挑的眼睛</span>
                  </div>
                </div>
                

              </div>
            </div>
                        <!-- 服饰 -->
            <div class="tags-category">
              <div class="category-title">服饰</div>
              <div class="tags-container" id="clothingTags">
                <div class="subcategory">
                  <div class="subcategory-title">上装</div>
                  <div class="tags-container" id="topsTags">
                    <span class="tag" data-value="连衣裙">连衣裙</span>
                        <span class="tag" data-value="衬衫">衬衫</span>
                        <span class="tag" data-value="T恤">T恤</span>
                        <span class="tag" data-value="毛衣">毛衣</span>
                        <span class="tag" data-value="西装">西装</span>
                        <span class="tag" data-value="骑士装">骑士装</span>
                        <span class="tag" data-value="外套">外套</span>
                        <span class="tag" data-value="雪衫">雪衫</span>
                        <span class="tag" data-value="披肩">披肩</span>
                        <span class="tag" data-value="旗袍">旗袍</span>
                        <span class="tag" data-value="斗篷">斗篷</span>
                        <span class="tag" data-value="大衣">大衣</span>
                        <span class="tag" data-value="毛皮大衣">毛皮大衣</span>
                  </div>
                </div>
                
                <div class="subcategory">
                  <div class="subcategory-title">下装</div>
                  <div class="tags-container" id="bottomsTags">
                    <span class="tag" data-value="牛仔裤">牛仔裤</span>
                        <span class="tag" data-value="裤子">裤子</span>
                        <span class="tag" data-value="连体裤">连体裤</span>
                        <span class="tag" data-value="短裤">短裤</span>
                        <span class="tag" data-value="长裤">长裤</span>
                        <span class="tag" data-value="裙子">裙子</span>
                        <span class="tag" data-value="打底裤">打底裤</span>
                        <span class="tag" data-value="紧身裤">紧身裤</span>
                        <span class="tag" data-value="便裤">便裤</span>
                        <span class="tag" data-value="阔腿裤">阔腿裤</span>
                        <span class="tag" data-value="七分裤">七分裤</span>
                        <span class="tag" data-value="短裙">短裙</span>
                        <span class="tag" data-value="中裙">中裙</span>
                        <span class="tag" data-value="长裙">长裙</span>
                        <span class="tag" data-value="运动裤">运动裤</span>
                        <span class="tag" data-value="卡其裤">卡其裤</span>
                        <span class="tag" data-value="牛仔短裤">牛仔短裤</span>
                        <span class="tag" data-value="裙裤">裙裤</span>
                        <span class="tag" data-value="束脚裤">束脚裤</span>
                        <span class="tag" data-value="哈伦裤">哈伦裤</span>
                  </div>
                </div>
                
                <div class="subcategory">
                  <div class="subcategory-title">泳装</div>
                  <div class="tags-container" id="swimwearTags">
                    <span class="tag" data-value="泳衣">泳衣</span>
                        <span class="tag" data-value="比基尼">比基尼</span>
                        <span class="tag" data-value="连体泳衣">连体泳衣</span>
                        <span class="tag" data-value="泳裤">泳裤</span>
                        <span class="tag" data-value="沙滩裙">沙滩裙</span>
                        <span class="tag" data-value="遮阳衣">遮阳衣</span>
                        <span class="tag" data-value="泳帽">泳帽</span>
                        <span class="tag" data-value="泳镜">泳镜</span>
                        <span class="tag" data-value="浮潜装备">浮潜装备</span>
                        <span class="tag" data-value="潜水衣">潜水衣</span>
                        <span class="tag" data-value="潜水裤">潜水裤</span>
                        <span class="tag" data-value="冲浪裤">冲浪裤</span>
                  </div>
                </div>
                
                <div class="subcategory">
                  <div class="subcategory-title">运动装</div>
                  <div class="tags-container" id="sportswearTags">
                    <span class="tag" data-value="运动文胸">运动文胸</span>
                    <span class="tag" data-value="运动上衣">运动上衣</span>
                    <span class="tag" data-value="运动裤">运动裤</span>
                    <span class="tag" data-value="运动短裤">运动短裤</span>
                    <span class="tag" data-value="运动紧身衣">运动紧身衣</span>
                    <span class="tag" data-value="运动套装">运动套装</span>
                    <span class="tag" data-value="运动连衣裙">运动连衣裙</span>
                    <span class="tag" data-value="健身服">健身服</span>
                    <span class="tag" data-value="跑步裤">跑步裤</span>
                    <span class="tag" data-value="篮球裤">篮球裤</span>
                    <span class="tag" data-value="网球裤">网球裤</span>
                    <span class="tag" data-value="足球裤">足球裤</span>
                    <span class="tag" data-value="高尔夫服">高尔夫服</span>
                    <span class="tag" data-value="瑜伽服">瑜伽服</span>
                    <span class="tag" data-value="太极服">太极服</span>
                    <span class="tag" data-value="拳击装">拳击装</span>
                    <span class="tag" data-value="羽毛球服">羽毛球服</span>
                    <span class="tag" data-value="游泳裤">游泳裤</span>
                    <span class="tag" data-value="健身紧身衣">健身紧身衣</span>
                    <span class="tag" data-value="长跑服">长跑服</span>
                  </div>  <!-- 这里将添加运动装的标签 -->
                </div>
                
                <div class="subcategory">
                  <div class="subcategory-title">内衣</div>
                  <div class="tags-container" id="underwearTags">
                    <span class="tag" data-value="文胸">文胸</span>
                    <span class="tag" data-value="内裤">内裤</span>
                    <span class="tag" data-value="丁字裤">丁字裤</span>
                    <span class="tag" data-value="连体内衣">连体内衣</span>
                    <span class="tag" data-value="睡衣">睡衣</span>
                    <span class="tag" data-value="腰衣">腰衣</span>
                    <span class="tag" data-value="丰胸垫">丰胸垫</span>
                    <span class="tag" data-value="背心">背心</span>
                    <span class="tag" data-value="泳装内衣">泳装内衣</span>
                    <span class="tag" data-value="塑身内衣">塑身内衣</span>
                    <span class="tag" data-value="胸衣">胸衣</span>
                    <span class="tag" data-value="纹身文胸">纹身文胸</span>
                    <span class="tag" data-value="吊带内衣">吊带内衣</span>
                    <span class="tag" data-value="无肩带文胸">无肩带文胸</span>
                    <span class="tag" data-value="无装饰文胸">无装饰文胸</span>
                    <span class="tag" data-value="无痕内衣">无痕内衣</span>
                    <span class="tag" data-value="小胸文胸">小胸文胸</span>
                    <span class="tag" data-value="大胸文胸">大胸文胸</span>
                  </div>  <!-- 这里将添加内衣的标签 -->
                </div>
                
                <div class="subcategory">
                  <div class="subcategory-title">配饰</div>
                  <div class="tags-container" id="accessoriesTags">
                    <span class="tag" data-value="项链">项链</span>
                    <span class="tag" data-value="耳环">耳环</span>
                    <span class="tag" data-value="手链">手链</span>
                    <span class="tag" data-value="戒指">戒指</span>
                    <span class="tag" data-value="围巾">围巾</span>
                    <span class="tag" data-value="帽子">帽子</span>
                    <span class="tag" data-value="手表">手表</span>
                    <span class="tag" data-value="腰带">腰带</span>
                    <span class="tag" data-value="大胆饰">大胆饰</span>
                    <span class="tag" data-value="包包">包包</span>
                    <span class="tag" data-value="发夹">发夹</span>
                    <span class="tag" data-value="发带">发带</span>
                    <span class="tag" data-value="项链套装">项链套装</span>
                    <span class="tag" data-value="手套">手套</span>
                    <span class="tag" data-value="眼镜">眼镜</span>
                    <span class="tag" data-value="胸花">胸花</span>
                    <span class="tag" data-value="围巾固定器">围巾固定器</span>
                    <span class="tag" data-value="项链坠子">项链坠子</span>
                  </div>
                </div>
                
                <div class="subcategory">
                  <div class="subcategory-title">鞋类</div>
                  <div class="tags-container" id="shoesTags">
                    <span class="tag" data-value="高跟鞋">高跟鞋</span>
                    <span class="tag" data-value="运动鞋">运动鞋</span>
                    <span class="tag" data-value="平底鞋">平底鞋</span>
                    <span class="tag" data-value="靴子">靴子</span>
                    <span class="tag" data-value="凉鞋">凉鞋</span>
                    <span class="tag" data-value="拖鞋">拖鞋</span>
                    <span class="tag" data-value="尖头鞋">尖头鞋</span>
                    <span class="tag" data-value="帆布鞋">帆布鞋</span>
                    <span class="tag" data-value="平底便鞋">平底便鞋</span>
                    <span class="tag" data-value="牛仔鞋">牛仔鞋</span>
                    <span class="tag" data-value="娃娃鞋">娃娃鞋</span>
                    <span class="tag" data-value="马丁靴">马丁靴</span>
                    <span class="tag" data-value="水鞋">水鞋</span>
                    <span class="tag" data-value="人字拖">人字拖</span>
                    <span class="tag" data-value="木底拖鞋">木底拖鞋</span>
                    <span class="tag" data-value="运动凉鞋">运动凉鞋</span>
                    <span class="tag" data-value="豆豆鞋">豆豆鞋</span>
                  </div>
                </div>
                
                <div class="subcategory">
                  <div class="subcategory-title">睡衣</div>
                  <div class="tags-container" id="pajamasTags">
                    <span class="tag" data-value="睡衣">睡衣</span>
                    <span class="tag" data-value="睡裙">睡裙</span>
                    <span class="tag" data-value="睡袍">睡袍</span>
                    <span class="tag" data-value="睡裤套装">睡裤套装</span>
                    <span class="tag" data-value="家居服">家居服</span>
                    <span class="tag" data-value="居家裤">居家裤</span>
                    <span class="tag" data-value="睡袍套装">睡袍套装</span>
                    <span class="tag" data-value="睡裙套装">睡裙套装</span>
                    <span class="tag" data-value="短睡裙套装">短睡裙套装</span>
                    <span class="tag" data-value="居家内衣">居家内衣</span>
                    <span class="tag" data-value="睡袍套装">睡袍套装</span>
                    <span class="tag" data-value="夜袍">夜袍</span>
                    <span class="tag" data-value="夜裙">夜裙</span>
                  </div>
                </div>
                
                <div class="subcategory">
                  <div class="subcategory-title">帽子</div>
                  <div class="tags-container" id="hatsTags">
                    <span class="tag" data-value="棒球帽">棒球帽</span>
                    <span class="tag" data-value="渔夫帽">渔夫帽</span>
                    <span class="tag" data-value="贝雷帽">贝雷帽</span>
                    <span class="tag" data-value="毛线帽">毛线帽</span>
                    <span class="tag" data-value="草帽">草帽</span>
                    <span class="tag" data-value="遮阳帽">遮阳帽</span>
                    <span class="tag" data-value="鸭舌帽">鸭舌帽</span>
                    <span class="tag" data-value="礼帽">礼帽</span>
                    <span class="tag" data-value="针织帽">针织帽</span>
                    <span class="tag" data-value="牛仔帽">牛仔帽</span>
                    <span class="tag" data-value="军帽">军帽</span>
                    <span class="tag" data-value="报童帽">报童帽</span>
                    <span class="tag" data-value="圆顶帽">圆顶帽</span>
                    <span class="tag" data-value="平顶帽">平顶帽</span>
                  </div>
                </div>
                
                <div class="subcategory">
                  <div class="subcategory-title">连体裤</div>
                  <div class="tags-container" id="jumpsuitTags">
                    <span class="tag" data-value="连体裤">连体裤</span>
                    <span class="tag" data-value="背带裤">背带裤</span>
                    <span class="tag" data-value="工装连体裤">工装连体裤</span>
                    <span class="tag" data-value="阔腿连体裤">阔腿连体裤</span>
                    <span class="tag" data-value="紧身连体裤">紧身连体裤</span>
                    <span class="tag" data-value="休闲连体裤">休闲连体裤</span>
                    <span class="tag" data-value="长筒连体裤">长筒连体裤</span>
                    <span class="tag" data-value="驼筒连体裤">驼筒连体裤</span>
                    <span class="tag" data-value="背带连体裤">背带连体裤</span>
                    <span class="tag" data-value="冬季连体裤">冬季连体裤</span>
                    <span class="tag" data-value="格子连体裤">格子连体裤</span>
                    <span class="tag" data-value="格子裤">格子裤</span>
                    <span class="tag" data-value="袜套">袜套</span>
                    <span class="tag" data-value="睡袜">睡袜</span>
                    <span class="tag" data-value="美腿裤">美腿裤</span>
                  </div>
                </div>
                
                <div class="subcategory">
                  <div class="subcategory-title">围巾</div>
                  <div class="tags-container" id="scarfTags">
                    <span class="tag" data-value="围巾">围巾</span>
                    <span class="tag" data-value="丝巾">丝巾</span>
                    <span class="tag" data-value="披肩">披肩</span>
                    <span class="tag" data-value="围巾固定器">围巾固定器</span>
                    <span class="tag" data-value="领巾">领巾</span>
                    <span class="tag" data-value="围巾环">围巾环</span>
                    <span class="tag" data-value="羊毛围巾">羊毛围巾</span>
                    <span class="tag" data-value="莱卡围巾">莱卡围巾</span>
                    <span class="tag" data-value="驼筒围巾">驼筒围巾</span>
                    <span class="tag" data-value="冬季围巾">冬季围巾</span>
                    <span class="tag" data-value="鸟巾">鸟巾</span>
                    <span class="tag" data-value="围巾套装">围巾套装</span>
                  </div>
                </div>
                
                <div class="subcategory">
                  <div class="subcategory-title">丝袜</div>
                  <div class="tags-container" id="stockingsTags">
                    <span class="tag" data-value="丝袜连裤袜">丝袜连裤袜</span>
                    <span class="tag" data-value="网纹丝袜">网纹丝袜</span>
                    <span class="tag" data-value="压力丝袜">压力丝袜</span>
                    <span class="tag" data-value="无缝丝袜">无缝丝袜</span>
                    <span class="tag" data-value="花边丝袜">花边丝袜</span>
                    <span class="tag" data-value="大网格丝袜">大网格丝袜</span>
                    <span class="tag" data-value="海绵丝袜">海绵丝袜</span>
                    <span class="tag" data-value="加强型丝袜">加强型丝袜</span>
                    <span class="tag" data-value="超薄丝袜">超薄丝袜</span>
                    <span class="tag" data-value="丝袜袜套">丝袜袜套</span>
                    <span class="tag" data-value="丝袜裤袜">丝袜裤袜</span>
                    <span class="tag" data-value="蕾丝丝袜">蕾丝丝袜</span>
                    <span class="tag" data-value="鱼网丝袜">鱼网丝袜</span>
                    <span class="tag" data-value="肉色丝袜">肉色丝袜</span>
                    <span class="tag" data-value="彩色丝袜">彩色丝袜</span>
                    <span class="tag" data-value="黑色丝袜">黑色丝袜</span>
                    <span class="tag" data-value="白色丝袜">白色丝袜</span>
                    <span class="tag" data-value="红色丝袜">红色丝袜</span>
                    <span class="tag" data-value="粉色丝袜">粉色丝袜</span>
                    <span class="tag" data-value="紫色丝袜">紫色丝袜</span>
                    <span class="tag" data-value="蓝色丝袜">蓝色丝袜</span>
                    <span class="tag" data-value="绿色丝袜">绿色丝袜</span>
                    <span class="tag" data-value="黄色丝袜">黄色丝袜</span>
                    <span class="tag" data-value="灰色丝袜">灰色丝袜</span>
                    <span class="tag" data-value="褐色丝袜">褐色丝袜</span>
                    <span class="tag" data-value="条纹丝袜">条纹丝袜</span>
                    <span class="tag" data-value="格子丝袜">格子丝袜</span>
                    <span class="tag" data-value="花卉丝袜">花卉丝袜</span>
                    <span class="tag" data-value="圆点丝袜">圆点丝袜</span>
                    <span class="tag" data-value="复古丝袜">复古丝袜</span>
                    <span class="tag" data-value="半透明丝袜">半透明丝袜</span>
                    <span class="tag" data-value="珠光丝袜">珠光丝袜</span>
                    <span class="tag" data-value="亮片丝袜">亮片丝袜</span>
                    <span class="tag" data-value="珍珠丝袜">珍珠丝袜</span>
                    <span class="tag" data-value="水钻丝袜">水钻丝袜</span>
                    <span class="tag" data-value="厚款丝袜">厚款丝袜</span>
                    <span class="tag" data-value="坎肩丝袜">坎肩丝袜</span>
                    <span class="tag" data-value="连体丝袜">连体丝袜</span>
                    <span class="tag" data-value="性感丝袜">性感丝袜</span>
                    <span class="tag" data-value="丝袜内衣套装">丝袜内衣套装</span>
                    <span class="tag" data-value="高腰丝袜">高腰丝袜</span>
                    <span class="tag" data-value="丝袜配饰">丝袜配饰</span>
                    <span class="tag" data-value="网状袜套">网状袜套</span>
                    <span class="tag" data-value="丝袜腿套">丝袜腿套</span>
                    <span class="tag" data-value="丝袜吊带">丝袜吊带</span>
                  </div>
                </div>
                
                <div class="subcategory">
                  <div class="subcategory-title">深V</div>
                  <div class="tags-container" id="deepVTags">
                    <span class="tag" data-value="深V领衬衫">深V领衬衫</span>
                    <span class="tag" data-value="深V领毛衣">深V领毛衣</span>
                    <span class="tag" data-value="深V上衣">深V上衣</span>
                    <span class="tag" data-value="深V连体裤">深V连体裤</span>
                    <span class="tag" data-value="深V紧身衣">深V紧身衣</span>
                    <span class="tag" data-value="深V背心">深V背心</span>
                    <span class="tag" data-value="深V带带连衣裙">深V带带连衣裙</span>
                    <span class="tag" data-value="深V连身短裤">深V连身短裤</span>
                    <span class="tag" data-value="深V礼服连衣裙">深V礼服连衣裙</span>
                    <span class="tag" data-value="深V商款针织衫">深V商款针织衫</span>
                    <span class="tag" data-value="深V运动上衣">深V运动上衣</span>
                    <span class="tag" data-value="深V丝绸连衣裙">深V丝绸连衣裙</span>
                    <span class="tag" data-value="深V夏季连衣裙">深V夏季连衣裙</span>
                    <span class="tag" data-value="深V短袖衬衫">深V短袖衬衫</span>
                    <span class="tag" data-value="深V包臀裙">深V包臀裙</span>
                    <span class="tag" data-value="深V吊带裙">深V吊带裙</span>
                    <span class="tag" data-value="深V蕾丝连衣裙">深V蕾丝连衣裙</span>
                    <span class="tag" data-value="深V连衣裙套装">深V连衣裙套装</span>
                    <span class="tag" data-value="深V带带上衣">深V带带上衣</span>
                    <span class="tag" data-value="深V连衣裙配饰">深V连衣裙配饰</span>
                    <span class="tag" data-value="深V连衣裙外套">深V连衣裙外套</span>
                    <span class="tag" data-value="深V连衣裙褶皱">深V连衣裙褶皱</span>
                    <span class="tag" data-value="深V拼接连衣裙">深V拼接连衣裙</span>
                    <span class="tag" data-value="深V卫衣连衣裙">深V卫衣连衣裙</span>
                    <span class="tag" data-value="深V夜店装">深V夜店装</span>
                    <span class="tag" data-value="深V纱裙连衣裙">深V纱裙连衣裙</span>
                    <span class="tag" data-value="深V轻丝上衣">深V轻丝上衣</span>
                    <span class="tag" data-value="深V透明连衣裙">深V透明连衣裙</span>
                    <span class="tag" data-value="深V复古连衣裙">深V复古连衣裙</span>
                    <span class="tag" data-value="深V宴会装">深V宴会装</span>
                    <span class="tag" data-value="深V无袖连衣裙">深V无袖连衣裙</span>
                    <span class="tag" data-value="深V花纹连衣裙">深V花纹连衣裙</span>
                    <span class="tag" data-value="深V运动连衣裙">深V运动连衣裙</span>
                    <span class="tag" data-value="深V紧身连衣裙">深V紧身连衣裙</span>
                    <span class="tag" data-value="深V皮质连衣裙">深V皮质连衣裙</span>
                  </div>
                </div>
                
                <div class="subcategory">
                  <div class="subcategory-title">包臀</div>
                  <div class="tags-container" id="hipHuggingTags">
                    <span class="tag" data-value="包臀连衣裙">包臀连衣裙</span>
                    <span class="tag" data-value="包臀裙">包臀裙</span>
                    <span class="tag" data-value="包臀上衣">包臀上衣</span>
                    <span class="tag" data-value="包臀连体裤">包臀连体裤</span>
                    <span class="tag" data-value="包臀家居裙">包臀家居裙</span>
                    <span class="tag" data-value="包臀礼服">包臀礼服</span>
                    <span class="tag" data-value="包臀针织裙">包臀针织裙</span>
                    <span class="tag" data-value="包臀运动短裤">包臀运动短裤</span>
                    <span class="tag" data-value="包臀派对服">包臀派对服</span>
                    <span class="tag" data-value="包臀高青连衣裙">包臀高青连衣裙</span>
                    <span class="tag" data-value="包臀剧烈装">包臀剧烈装</span>
                    <span class="tag" data-value="包臀半身裙">包臀半身裙</span>
                    <span class="tag" data-value="包臀连衣裙套装">包臀连衣裙套装</span>
                    <span class="tag" data-value="包臀效果裙">包臀效果裙</span>
                    <span class="tag" data-value="包臀夏季连衣裙">包臀夏季连衣裙</span>
                    <span class="tag" data-value="包臀毛呢裙">包臀毛呢裙</span>
                    <span class="tag" data-value="包臀花纹裙">包臀花纹裙</span>
                    <span class="tag" data-value="包臀夏日裙子">包臀夏日裙子</span>
                  </div>
                </div>
                
                <div class="subcategory">
                  <div class="subcategory-title">蕾丝</div>
                  <div class="tags-container" id="laceTags">
                    <span class="tag" data-value="蕾丝连衣裙">蕾丝连衣裙</span>
                    <span class="tag" data-value="蕾丝上衣">蕾丝上衣</span>
                    <span class="tag" data-value="蕾丝裙子">蕾丝裙子</span>
                    <span class="tag" data-value="蕾丝连体裤">蕾丝连体裤</span>
                    <span class="tag" data-value="蕾丝袜子">蕾丝袜子</span>
                    <span class="tag" data-value="蕾丝外套">蕾丝外套</span>
                    <span class="tag" data-value="蕾丝背心">蕾丝背心</span>
                    <span class="tag" data-value="蕾丝内衣">蕾丝内衣</span>
                    <span class="tag" data-value="蕾丝长袖上衣">蕾丝长袖上衣</span>
                    <span class="tag" data-value="蕾丝吊带上衣">蕾丝吊带上衣</span>
                    <span class="tag" data-value="蕾丝连衣裙配饰">蕾丝连衣裙配饰</span>
                    <span class="tag" data-value="蕾丝短上衣">蕾丝短上衣</span>
                    <span class="tag" data-value="蕾丝袖套">蕾丝袖套</span>
                    <span class="tag" data-value="蕾丝贴边裙">蕾丝贴边裙</span>
                    <span class="tag" data-value="蕾丝花边上衣">蕾丝花边上衣</span>
                    <span class="tag" data-value="蕾丝花边连衣裙">蕾丝花边连衣裙</span>
                    <span class="tag" data-value="蕾丝夏季裙">蕾丝夏季裙</span>
                    <span class="tag" data-value="蕾丝春季外套">蕾丝春季外套</span>
                    <span class="tag" data-value="蕾丝晚礼服">蕾丝晚礼服</span>
                    <span class="tag" data-value="蕾丝连体裙">蕾丝连体裙</span>
                  </div>
                </div>
                
                <div class="subcategory">
                  <div class="subcategory-title">裙子</div>
                  <div class="tags-container" id="skirtTags">
                    <span class="tag" data-value="连衣裙">连衣裙</span>
                    <span class="tag" data-value="迷你裙">迷你裙</span>
                    <span class="tag" data-value="中裙">中裙</span>
                    <span class="tag" data-value="长裙">长裙</span>
                    <span class="tag" data-value="半身裙">半身裙</span>
                    <span class="tag" data-value="包臀裙">包臀裙</span>
                    <span class="tag" data-value="百褶裙">百褶裙</span>
                    <span class="tag" data-value="牛仔裙">牛仔裙</span>
                    <span class="tag" data-value="礼服裙">礼服裙</span>
                    <span class="tag" data-value="夏季裙">夏季裙</span>
                    <span class="tag" data-value="冬季裙">冬季裙</span>
                    <span class="tag" data-value="花卉裙">花卉裙</span>
                    <span class="tag" data-value="印花裙">印花裙</span>
                    <span class="tag" data-value="纱裙">纱裙</span>
                    <span class="tag" data-value="针织裙">针织裙</span>
                    <span class="tag" data-value="派对裙">派对裙</span>
                    <span class="tag" data-value="背心裙">背心裙</span>
                    <span class="tag" data-value="吊带裙">吊带裙</span>
                    <span class="tag" data-value="包裹裙">包裹裙</span>
                    <span class="tag" data-value="无袖裙">无袖裙</span>
                    <span class="tag" data-value="宴会裙">宴会裙</span>
                    <span class="tag" data-value="露肩裙">露肩裙</span>
                    <span class="tag" data-value="连体裙">连体裙</span>
                    <span class="tag" data-value="迷你连衣裙">迷你连衣裙</span>
                    <span class="tag" data-value="深V连衣裙">深V连衣裙</span>
                    <span class="tag" data-value="丝绒裙">丝绒裙</span>
                    <span class="tag" data-value="复古裙">复古裙</span>
                    <span class="tag" data-value="亮片裙">亮片裙</span>
                    <span class="tag" data-value="系丝裙">系丝裙</span>
                    <span class="tag" data-value="格子裙">格子裙</span>
                    <span class="tag" data-value="牛仔迷你裙">牛仔迷你裙</span>
                    <span class="tag" data-value="棉质连衣裙">棉质连衣裙</span>
                    <span class="tag" data-value="运动裙">运动裙</span>
                    <span class="tag" data-value="低背连衣裙">低背连衣裙</span>
                    <span class="tag" data-value="高领连衣裙">高领连衣裙</span>
                    <span class="tag" data-value="珍珠裙">珍珠裙</span>
                    <span class="tag" data-value="水钻裙">水钻裙</span>
                    <span class="tag" data-value="条纹裙">条纹裙</span>
                    <span class="tag" data-value="亮片迷你裙">亮片迷你裙</span>
                    <span class="tag" data-value="印花迷你裙">印花迷你裙</span>
                    <span class="tag" data-value="薄纱连衣裙">薄纱连衣裙</span>
                    <span class="tag" data-value="无袖连衣裙">无袖连衣裙</span>
                    <span class="tag" data-value="背带连衣裙">背带连衣裙</span>
                    <span class="tag" data-value="魔法迷你裙">魔法迷你裙</span>
                  </div>
                </div>
                
                <div class="subcategory">
                  <div class="subcategory-title">制服COS</div>
                  <div class="tags-container" id="uniformCosTags">
                    <span class="tag" data-value="职场制服">职场制服</span>
                    <span class="tag" data-value="校服">校服</span>
                    <span class="tag" data-value="水手服">水手服</span>
                    <span class="tag" data-value="护士">护士</span>
                    <span class="tag" data-value="警服">警服</span>
                    <span class="tag" data-value="海军制服">海军制服</span>
                    <span class="tag" data-value="陆军制服">陆军制服</span>
                    <span class="tag" data-value="女仆装">女仆装</span>
                    <span class="tag" data-value="围裙">围裙</span>
                    <span class="tag" data-value="厨师工装">厨师工装</span>
                    <span class="tag" data-value="手术服">手术服</span>
                    <span class="tag" data-value="实验服">实验服</span>
                    <span class="tag" data-value="啦啦队服">啦啦队服</span>
                    <span class="tag" data-value="燕尾服">燕尾服</span>
                    <span class="tag" data-value="礼服">礼服</span>
                    <span class="tag" data-value="婚纱">婚纱</span>
                    <span class="tag" data-value="巫女服">巫女服</span>
                    <span class="tag" data-value="修女服">修女服</span>
                    <span class="tag" data-value="兔子服装">兔子服装</span>
                    <span class="tag" data-value="猫咪服装">猫咪服装</span>
                    <span class="tag" data-value="皮老狗">皮老狗</span>
                    <span class="tag" data-value="熊套装">熊套装</span>
                    <span class="tag" data-value="圣诞风格服装">圣诞风格服装</span>
                    <span class="tag" data-value="猫甲">猫甲</span>
                    <span class="tag" data-value="比基尼盔甲">比基尼盔甲</span>
                    <span class="tag" data-value="穿着全套盔甲的">穿着全套盔甲的</span>
                    <span class="tag" data-value="板甲">板甲</span>
                    <span class="tag" data-value="日本甲胄">日本甲胄</span>
                    <span class="tag" data-value="动力装甲">动力装甲</span>
                    <span class="tag" data-value="机甲">机甲</span>
                    <span class="tag" data-value="头盔">头盔</span>
                    <span class="tag" data-value="头盔(日式)">头盔(日式)</span>
                    <span class="tag" data-value="鳞甲护臂">鳞甲护臂</span>
                    <span class="tag" data-value="肩甲">肩甲</span>
                    <span class="tag" data-value="日本弓道护臂甲">日本弓道护臂甲</span>
                    <span class="tag" data-value="胸甲">胸甲</span>
                    <span class="tag" data-value="腹甲">腹甲</span>
                    <span class="tag" data-value="臀甲">臀甲</span>
                    <span class="tag" data-value="装甲靴">装甲靴</span>
                    <span class="tag" data-value="道袍">道袍</span>
                    <span class="tag" data-value="长袍">长袍</span>
                    <span class="tag" data-value="混合长袍">混合长袍</span>
                    <span class="tag" data-value="斗篷">斗篷</span>
                    <span class="tag" data-value="羽衣">羽衣</span>
                  </div>
                </div>
                
                <div class="subcategory">
                  <div class="subcategory-title">传统服饰</div>
                  <div class="tags-container" id="traditionalClothesTags">
                    <span class="tag" data-value="中国服饰">中国服饰</span>
                    <span class="tag" data-value="中国风">中国风</span>
                    <span class="tag" data-value="旗袍">旗袍</span>
                    <span class="tag" data-value="印花旗袍">印花旗袍</span>
                    <span class="tag" data-value="汉服">汉服</span>
                    <span class="tag" data-value="汉服唐风">汉服唐风</span>
                    <span class="tag" data-value="上衫">上衫</span>
                    <span class="tag" data-value="长上衫">长上衫</span>
                    <span class="tag" data-value="齐腰襦裙">齐腰襦裙</span>
                    <span class="tag" data-value="系带">系带</span>
                    <span class="tag" data-value="披帛">披帛</span>
                    <span class="tag" data-value="汉服宋风">汉服宋风</span>
                    <span class="tag" data-value="褙子">褙子</span>
                    <span class="tag" data-value="长褙">长褙</span>
                    <span class="tag" data-value="宋抹">宋抹</span>
                    <span class="tag" data-value="百褶裙">百褶裙</span>
                    <span class="tag" data-value="汉服明风">汉服明风</span>
                    <span class="tag" data-value="短袄">短袄</span>
                    <span class="tag" data-value="长袄">长袄</span>
                    <span class="tag" data-value="马面裙">马面裙</span>
                    <span class="tag" data-value="交领">交领</span>
                    <span class="tag" data-value="圆领">圆领</span>
                    <span class="tag" data-value="立领">立领</span>
                    <span class="tag" data-value="方领">方领</span>
                    <span class="tag" data-value="云肩">云肩</span>
                    <span class="tag" data-value="褶裥">褶裥</span>
                    <span class="tag" data-value="蛇金">蛇金</span>
                    <span class="tag" data-value="妆花">妆花</span>
                    <span class="tag" data-value="补服">补服</span>
                    <span class="tag" data-value="和服">和服</span>
                    <span class="tag" data-value="印花和服">印花和服</span>
                    <span class="tag" data-value="衣带(和服用)">衣带(和服用)</span>
                    <span class="tag" data-value="浴衣">浴衣</span>
                    <span class="tag" data-value="韩服">韩服</span>
                    <span class="tag" data-value="朝鲜服饰">朝鲜服饰</span>
                    <span class="tag" data-value="西班风格">西班风格</span>
                    <span class="tag" data-value="德国服装">德国服装</span>
                    <span class="tag" data-value="哥特风格">哥特风格</span>
                    <span class="tag" data-value="洛丽塔风格">洛丽塔风格</span>
                    <span class="tag" data-value="拜占庭风格">拜占庭风格</span>
                    <span class="tag" data-value="热带特征的">热带特征的</span>
                    <span class="tag" data-value="印度风格">印度风格</span>
                    <span class="tag" data-value="越南校服 (奥黛)">越南校服 (奥黛)</span>
                    <span class="tag" data-value="阿伊努人的服饰">阿伊努人的服饰</span>
                    <span class="tag" data-value="阿拉伯服饰">阿拉伯服饰</span>
                    <span class="tag" data-value="埃及风格服饰">埃及风格服饰</span>
                  </div>
                </div>
              </div>
            </div>
       
            <!-- 情感、动作/表情、道具子类 -->
            <div class="tags-category">
              <div class="category-title">情景</div>
              <div class="tags-container" id="sceneTags">
                <span class="tag" data-value="化妆">化妆</span>
                <span class="tag" data-value="洗澡">洗澡</span>
                <span class="tag" data-value="入浴">入浴</span>
                <span class="tag" data-value="咬">咬</span>
                <span class="tag" data-value="鞭打">鞭打</span>
                <span class="tag" data-value="刷牙">刷牙</span>
                <span class="tag" data-value="吹泡泡">吹泡泡</span>
                <span class="tag" data-value="泪痕">泪痕</span>
                <span class="tag" data-value="打打">打打</span>
                <span class="tag" data-value="拿起">拿起</span>
                <span class="tag" data-value="深红">深红</span>
                <span class="tag" data-value="哭">哭</span>
                <span class="tag" data-value="潜水">潜水</span>
                <span class="tag" data-value="拉弓">拉弓</span>
                <span class="tag" data-value="嚼">嚼</span>
                <span class="tag" data-value="驾驶">驾驶</span>
                <span class="tag" data-value="(意外)声音">(意外)声音</span>
                <span class="tag" data-value="弄干(浴后)">弄干(浴后)</span>
                <span class="tag" data-value="双持">双持</span>
                <span class="tag" data-value="吃饭">吃饭</span>
                <span class="tag" data-value="做运动">做运动</span>
                <span class="tag" data-value="战斗姿态(摆架势的)">战斗姿态(摆架势的)</span>
                <span class="tag" data-value="射击">射击</span>
                <span class="tag" data-value="钓鱼">钓鱼</span>
                <span class="tag" data-value="剁肉">剁肉</span>
                <span class="tag" data-value="飞踢">飞踢</span>
                <span class="tag" data-value="梳头">梳头</span>
                <span class="tag" data-value="撩头发">撩头发</span>
                <span class="tag" data-value="吊起来的">吊起来的</span>
                <span class="tag" data-value="击打">击打</span>
                <span class="tag" data-value="在想象的">在想象的</span>
                <span class="tag" data-value="跳跃">跳跃</span>
                <span class="tag" data-value="踢">踢</span>
                <span class="tag" data-value="演奏乐器">演奏乐器</span>
                <span class="tag" data-value="骑管弹">骑管弹</span>
                <span class="tag" data-value="折磨">折磨</span>
                <span class="tag" data-value="展示">展示</span>
                <span class="tag" data-value="挥拳">挥拳</span>
                <span class="tag" data-value="推送">推送</span>
                <span class="tag" data-value="阅读">阅读</span>
                <span class="tag" data-value="骑">骑</span>
                <span class="tag" data-value="奔跑">奔跑</span>
                <span class="tag" data-value="缝纫">缝纫</span>
                <span class="tag" data-value="购物">购物</span>
                <span class="tag" data-value="淋浴">淋浴</span>
                <span class="tag" data-value="唱歌">唱歌</span>
                <span class="tag" data-value="扑克牌">扑克牌</span>
                <span class="tag" data-value="打游戏">打游戏</span>
              </div>
            </div>
            
            <div class="tags-category">
              <div class="category-title">动作/表情</div>
              <div class="tags-container" id="expressionTags">
                <div class="subcategory">
                   <div class="subcategory-title">单人姿态</div>
                   <div class="tags-container" id="singlePersonPoseTags">
                     <span class="tag" data-value="行走">行走</span>
                     <span class="tag" data-value="转身">转身</span>
                     <span class="tag" data-value="摆动">摆动</span>
                     <span class="tag" data-value="弯腰">弯腰</span>
                     <span class="tag" data-value="高抬腿">高抬腿</span>
                     <span class="tag" data-value="拉伸">拉伸</span>
                     <span class="tag" data-value="手势">手势</span>
                     <span class="tag" data-value="双手放腰">双手放腰</span>
                     <span class="tag" data-value="站立">站立</span>
                     <span class="tag" data-value="跪">跪</span>
                     <span class="tag" data-value="趴">趴</span>
                     <span class="tag" data-value="骑">骑</span>
                     <span class="tag" data-value="侧躺">侧躺</span>
                     <span class="tag" data-value="靠在一起的">靠在一起的</span>
                     <span class="tag" data-value="胎儿姿势(蜷)">胎儿姿势(蜷)</span>
                   </div>
                 </div>
                
                <div class="subcategory">
                  <div class="subcategory-title">多人互动</div>
                  <div class="tags-container" id="multiPersonInteractionTags">
                    <span class="tag" data-value="胸对胸/额对额/顶着胸">胸对胸/额对额/顶着胸</span>
                    <span class="tag" data-value="背对背">背对背</span>
                    <span class="tag" data-value="眼对眼（对视）">眼对眼（对视）</span>
                    <span class="tag" data-value="二人面对面(距离很近)">二人面对面(距离很近)</span>
                    <span class="tag" data-value="喂食">喂食</span>
                    <span class="tag" data-value="口内手指">口内手指</span>
                    <span class="tag" data-value="牵手">牵手</span>
                    <span class="tag" data-value="拥抱">拥抱</span>
                    <span class="tag" data-value="即将接吻">即将接吻</span>
                    <span class="tag" data-value="递食物">递食物</span>
                    <span class="tag" data-value="递礼物">递礼物</span>
                    <span class="tag" data-value="等待接吻/献吻">等待接吻/献吻</span>
                    <span class="tag" data-value="壁咚">壁咚</span>
                    <span class="tag" data-value="膝枕">膝枕</span>
                    <span class="tag" data-value="抱住勾">抱住勾</span>
                    <span class="tag" data-value="公主抱">公主抱</span>
                    <span class="tag" data-value="舌头">舌头</span>
                    <span class="tag" data-value="吐舌头">吐舌头</span>
                    <span class="tag" data-value="小舌头口盖亡|舌苞">小舌头口盖亡|舌苞</span>
                    <span class="tag" data-value="咬耳朵">咬耳朵</span>
                  </div>
                </div>
                
                <div class="subcategory">
                  <div class="subcategory-title">手部</div>
                  <div class="tags-container" id="handGestureTags">
                    <span class="tag" data-value="手放在胸边">手放在胸边</span>
                    <span class="tag" data-value="爪手势">爪手势</span>
                    <span class="tag" data-value="招财猫手势(下弯手腕)">招财猫手势(下弯手腕)</span>
                    <span class="tag" data-value="狐狸手势">狐狸手势</span>
                    <span class="tag" data-value="手指枪手势">手指枪手势</span>
                    <span class="tag" data-value="胜利手势">胜利手势</span>
                    <span class="tag" data-value="双V">双V</span>
                    <span class="tag" data-value="翘大拇指">翘大拇指</span>
                    <span class="tag" data-value="食指指起">食指指起</span>
                    <span class="tag" data-value="国际友好手势">国际友好手势</span>
                    <span class="tag" data-value="用手指做出笑脸">用手指做出笑脸</span>
                    <span class="tag" data-value="摸眼泪">摸眼泪</span>
                    <span class="tag" data-value="OK手势">OK手势</span>
                    <span class="tag" data-value="遮阳手势">遮阳手势</span>
                    <span class="tag" data-value="噤(手势)">噤(手势)</span>
                    <span class="tag" data-value="手指伸出嘴里">手指伸出嘴里</span>
                    <span class="tag" data-value="双手手指交叉(双手紧握)">双手手指交叉(双手紧握)</span>
                    <span class="tag" data-value="整头发/手指卷头发">整头发/手指卷头发</span>
                    <span class="tag" data-value="扶眼镜">扶眼镜</span>
                    <span class="tag" data-value="理头发">理头发</span>
                    <span class="tag" data-value="披风帽子">披风帽子</span>
                    <span class="tag" data-value="掀起自己的衣物">掀起自己的衣物</span>
                    <span class="tag" data-value="拉起掀起裙子形成的篮子形状">拉起掀起裙子形成的篮子形状</span>
                    <span class="tag" data-value="指敲起裙子形成的篮子形状">指敲起裙子形成的篮子形状</span>
                    <span class="tag" data-value="对下裙子腰口的部分">对下裙子腰口的部分</span>
                    <span class="tag" data-value="往上对开的比基尼">往上对开的比基尼</span>
                    <span class="tag" data-value="将裙子散上去">将裙子散上去</span>
                    <span class="tag" data-value="往上衣物的吊带">往上衣物的吊带</span>
                    <span class="tag" data-value="起风效果|上升气流">起风效果|上升气流</span>
                    <span class="tag" data-value="拉着口罩">拉着口罩</span>
                    <span class="tag" data-value="拉着裤子">拉着裤子</span>
                    <span class="tag" data-value="手抓衣部">手抓衣部</span>
                    <span class="tag" data-value="用手遮住胸部">用手遮住胸部</span>
                    <span class="tag" data-value="抱胸颤">抱胸颤</span>
                    <span class="tag" data-value="摸下巴">摸下巴</span>
                    <span class="tag" data-value="展现魅力的姿势">展现魅力的姿势</span>
                    <span class="tag" data-value="手持杯子">手持杯子</span>
                  </div>
                </div>
                
                <div class="subcategory">
                  <div class="subcategory-title">腿部</div>
                  <div class="tags-container" id="legGestureTags">
                    <span class="tag" data-value="张腿">张腿</span>
                    <span class="tag" data-value="两腿并拢">两腿并拢</span>
                    <span class="tag" data-value="二郎腿">二郎腿</span>
                    <span class="tag" data-value="I字腿型">I字腿型</span>
                    <span class="tag" data-value="屈膝礼（女仆行礼）">屈膝礼（女仆行礼）</span>
                    <span class="tag" data-value="双腿之间的手">双腿之间的手</span>
                    <span class="tag" data-value="裙摆">裙摆</span>
                    <span class="tag" data-value="挡住关键部位的腿">挡住关键部位的腿</span>
                    <span class="tag" data-value="V字张腿">V字张腿</span>
                    <span class="tag" data-value="用双腿夹住">用双腿夹住</span>
                    <span class="tag" data-value="双腿抬起">双腿抬起</span>
                    <span class="tag" data-value="双腿交叉站姿">双腿交叉站姿</span>
                    <span class="tag" data-value="膝盖合并，两腿分开">膝盖合并，两腿分开</span>
                    <span class="tag" data-value="膝盖上有动物">膝盖上有动物</span>
                    <span class="tag" data-value="手放在自己的膝盖上">手放在自己的膝盖上</span>
                    <span class="tag" data-value="顶起膝盖">顶起膝盖</span>
                    <span class="tag" data-value="膝盖靠到胸前">膝盖靠到胸前</span>
                    <span class="tag" data-value="膝盖顶到胸部">膝盖顶到胸部</span>
                    <span class="tag" data-value="鸭子坐">鸭子坐</span>
                    <span class="tag" data-value="正坐">正坐</span>
                    <span class="tag" data-value="跨坐">跨坐</span>
                    <span class="tag" data-value="侧身坐">侧身坐</span>
                    <span class="tag" data-value="蹲下，张开双腿">蹲下，张开双腿</span>
                    <span class="tag" data-value="一只膝盖">一只膝盖</span>
                    <span class="tag" data-value="下蹲">下蹲</span>
                    <span class="tag" data-value="四肢着地">四肢着地</span>
                    <span class="tag" data-value="凹版姿势">凹版姿势</span>
                    <span class="tag" data-value="高跷">高跷</span>
                    <span class="tag" data-value="泡脚">泡脚</span>
                  </div>
                </div>
                
                <div class="subcategory">
                  <div class="subcategory-title">眼神</div>
                  <div class="tags-container" id="eyeExpressionTags">
                    <span class="tag" data-value="面向镜头">面向镜头</span>
                    <span class="tag" data-value="看向镜头">看向镜头</span>
                    <span class="tag" data-value="眼神接触">眼神接触</span>
                    <span class="tag" data-value="盯着看">盯着看</span>
                    <span class="tag" data-value="凝视">凝视</span>
                    <span class="tag" data-value="回眸">回眸</span>
                    <span class="tag" data-value="人物侧脸">人物侧脸</span>
                    <span class="tag" data-value="人物现向下看">人物现向下看</span>
                    <span class="tag" data-value="人物现向抬头看">人物现向抬头看</span>
                    <span class="tag" data-value="面向别处">面向别处</span>
                    <span class="tag" data-value="看向侧面">看向侧面</span>
                    <span class="tag" data-value="看着别处">看着别处</span>
                    <span class="tag" data-value="浮望">浮望</span>
                    <span class="tag" data-value="向外看">向外看</span>
                    <span class="tag" data-value="歪头">歪头</span>
                    <span class="tag" data-value="低头">低头</span>
                    <span class="tag" data-value="照镜子">照镜子</span>
                  </div>
                </div>
                
                <div class="subcategory">
                  <div class="subcategory-title">表情</div>
                  <div class="tags-container" id="facialExpressionTags">
                    <span class="tag" data-value="微笑">微笑</span>
                    <span class="tag" data-value="害羞的微笑">害羞的微笑</span>
                    <span class="tag" data-value="大笑">大笑</span>
                    <span class="tag" data-value="开心">开心</span>
                    <span class="tag" data-value="露齿咧嘴笑">露齿咧嘴笑</span>
                    <span class="tag" data-value="嘴角微笑">嘴角微笑</span>
                    <span class="tag" data-value="魅惑的微笑">魅惑的微笑</span>
                    <span class="tag" data-value="自鸣得意的笑">自鸣得意的笑</span>
                    <span class="tag" data-value="咯咯的笑">咯咯的笑</span>
                    <span class="tag" data-value="洋洋得意">洋洋得意</span>
                    <span class="tag" data-value="调皮的脸">调皮的脸</span>
                    <span class="tag" data-value="邪恶笑">邪恶笑</span>
                    <span class="tag" data-value="疯狂的笑">疯狂的笑</span>
                    <span class="tag" data-value="快乐幸福">快乐幸福</span>
                    <span class="tag" data-value="阿塞颜">阿塞颜</span>
                    <span class="tag" data-value="忍耐的表情">忍耐的表情</span>
                    <span class="tag" data-value="忍耐">忍耐</span>
                    <span class="tag" data-value="黑化的">黑化的</span>
                    <span class="tag" data-value="疯狂的">疯狂的</span>
                    <span class="tag" data-value="愤怒力尽的">愤怒力尽的</span>
                    <span class="tag" data-value="傲娇">傲娇</span>
                    <span class="tag" data-value="痴汉">痴汉</span>
                    <span class="tag" data-value="多重人格">多重人格</span>
                    <span class="tag" data-value="嘟嘴">嘟嘴</span>
                    <span class="tag" data-value="翻白眼(高潮眼)">翻白眼(高潮眼)</span>
                    <span class="tag" data-value="娇妒">娇妒</span>
                    <span class="tag" data-value="绝顶">绝顶</span>
                    <span class="tag" data-value="重呼吸">重呼吸</span>
                    <span class="tag" data-value="淫气">淫气</span>
                    <span class="tag" data-value="哺乳">哺乳</span>
                    <span class="tag" data-value="猥琐的眼神">猥琐的眼神</span>
                    <span class="tag" data-value="轻蔑">轻蔑</span>
                    <span class="tag" data-value="蔑视">蔑视</span>
                    <span class="tag" data-value="脸上有阴影，黑色蔑视">脸上有阴影，黑色蔑视</span>
                    <span class="tag" data-value="害羞的眼神">害羞的眼神</span>
                    <span class="tag" data-value="愤怒/愤慨">愤怒/愤慨</span>
                    <span class="tag" data-value="眉头紧锁">眉头紧锁</span>
                    <span class="tag" data-value="生气">生气</span>
                    <span class="tag" data-value="尖叫">尖叫</span>
                    <span class="tag" data-value="生气的">生气的</span>
                    <span class="tag" data-value="窘迫">窘迫</span>
                    <span class="tag" data-value="怒目而视">怒目而视</span>
                    <span class="tag" data-value="严肃的">严肃的</span>
                    <span class="tag" data-value="侧头瞪着你">侧头瞪着你</span>
                    <span class="tag" data-value="伤心">伤心</span>
                    <span class="tag" data-value="恐惧">恐惧</span>
                    <span class="tag" data-value="大哭">大哭</span>
                    <span class="tag" data-value="泪如雨下">泪如雨下</span>
                    <span class="tag" data-value="静静睡觉">静静睡觉</span>
                    <span class="tag" data-value="流泪">流泪</span>
                    <span class="tag" data-value="泪眼">泪眼</span>
                    <span class="tag" data-value="擦眼泪">擦眼泪</span>
                    <span class="tag" data-value="心情不好">心情不好</span>
                    <span class="tag" data-value="不开心的">不开心的</span>
                    <span class="tag" data-value="沮丧">沮丧</span>
                    <span class="tag" data-value="沮丧的眼泪">沮丧的眼泪</span>
                    <span class="tag" data-value="苦恼的">苦恼的</span>
                    <span class="tag" data-value="苦闷">苦闷</span>
                    <span class="tag" data-value="叹气">叹气</span>
                    <span class="tag" data-value="忧虑的">忧虑的</span>
                    <span class="tag" data-value="失望的">失望的</span>
                    <span class="tag" data-value="绝望">绝望</span>
                    <span class="tag" data-value="疼痛">疼痛</span>
                  </div>
                </div>
              </div>
            </div>
            
           
            

            
          </div>
          
          <!-- 场景 -->
          <div class="tags-category-content" id="场景">
            <!-- 自然 -->
            <div class="tags-category">
              <div class="category-title">自然</div>
              <div class="tags-container" id="natureTags">
                <span class="tag" data-value="大海">大海</span>
                <span class="tag" data-value="海滩">海滩</span>
                <span class="tag" data-value="湖泊">湖泊</span>
                <span class="tag" data-value="瀑布">瀑布</span>
                <span class="tag" data-value="夜空">夜空</span>
                <span class="tag" data-value="星空">星空</span>
                <span class="tag" data-value="星云">星云</span>
                <span class="tag" data-value="超级银河">超级银河</span>
                <span class="tag" data-value="星星轨迹">星星轨迹</span>
                <span class="tag" data-value="落日">落日</span>
                <span class="tag" data-value="月亮">月亮</span>
                <span class="tag" data-value="月牙">月牙</span>
                <span class="tag" data-value="新月">新月</span>
                <span class="tag" data-value="满月">满月</span>
                <span class="tag" data-value="月光">月光</span>
                <span class="tag" data-value="璀璨月光">璀璨月光</span>
                <span class="tag" data-value="宇宙">宇宙</span>
                <span class="tag" data-value="太空">太空</span>
                <span class="tag" data-value="星球">星球</span>
                <span class="tag" data-value="地平线">地平线</span>
                <span class="tag" data-value="多山的地平线">多山的地平线</span>
                <span class="tag" data-value="牧场">牧场</span>
                <span class="tag" data-value="高原">高原</span>
                <span class="tag" data-value="花园">花园</span>
                <span class="tag" data-value="田园">田园</span>
                <span class="tag" data-value="浮岛">浮岛</span>
                <span class="tag" data-value="森林">森林</span>
                <span class="tag" data-value="草原">草原</span>
                <span class="tag" data-value="花田">花田</span>
                <span class="tag" data-value="花海">花海</span>
                <span class="tag" data-value="火山">火山</span>
                <span class="tag" data-value="复杂">复杂</span>
                <span class="tag" data-value="雪山">雪山</span>
                <span class="tag" data-value="春">春</span>
                <span class="tag" data-value="秋">秋</span>
                <span class="tag" data-value="冬">冬</span>
                <span class="tag" data-value="夏">夏</span>
              </div>
            </div>
            
            <!-- 室外 -->
            <div class="tags-category">
              <div class="category-title">室外</div>
              <div class="tags-container" id="outdoorTags">
                <span class="tag" data-value="公园">公园</span>
                <span class="tag" data-value="吊架, 秋千">吊架, 秋千</span>
                <span class="tag" data-value="面包店">面包店</span>
                <span class="tag" data-value="咖啡厅">咖啡厅</span>
                <span class="tag" data-value="植物园">植物园</span>
                <span class="tag" data-value="城堡">城堡</span>
                <span class="tag" data-value="竞技场">竞技场</span>
                <span class="tag" data-value="礼堂">礼堂</span>
                <span class="tag" data-value="音乐会">音乐会</span>
                <span class="tag" data-value="书店">书店</span>
                <span class="tag" data-value="日本旅馆">日本旅馆</span>
                <span class="tag" data-value="监狱酒吧">监狱酒吧</span>
                <span class="tag" data-value="在电影院里">在电影院里</span>
                <span class="tag" data-value="舞台">舞台</span>
                <span class="tag" data-value="港口">港口</span>
                <span class="tag" data-value="剧场">剧场</span>
                <span class="tag" data-value="台球室">台球室</span>
                <span class="tag" data-value="地牢">地牢</span>
                <span class="tag" data-value="校舍">校舍</span>
                <span class="tag" data-value="索姆斯">索姆斯</span>
                <span class="tag" data-value="马丘比丘">马丘比丘</span>
                <span class="tag" data-value="明石海峡大桥">明石海峡大桥</span>
                <span class="tag" data-value="东京天空树">东京天空树</span>
                <span class="tag" data-value="富士山">富士山</span>
                <span class="tag" data-value="东京塔">东京塔</span>
                <span class="tag" data-value="伏见稻荷">伏见稻荷</span>
                <span class="tag" data-value="大峡谷">大峡谷</span>
                <span class="tag" data-value="长城">长城</span>
                <span class="tag" data-value="希腊_圣托里尼">希腊_圣托里尼</span>
                <span class="tag" data-value="意大利_威尼斯">意大利_威尼斯</span>
                <span class="tag" data-value="铁路">铁路</span>
              </div>
            </div>
            
            <!-- 城市 -->
            <div class="tags-category">
              <div class="category-title">城市</div>
              <div class="tags-container" id="cityTags">
                <span class="tag" data-value="天际线">天际线</span>
                <span class="tag" data-value="城市风景">城市风景</span>
                <span class="tag" data-value="街道">街道</span>
                <span class="tag" data-value="市中心">市中心</span>
                <span class="tag" data-value="人群">人群</span>
                <span class="tag" data-value="小巷">小巷</span>
                <span class="tag" data-value="大道">大道</span>
                <span class="tag" data-value="路口">路口</span>
                <span class="tag" data-value="草坪">草坪</span>
                <span class="tag" data-value="路径">路径</span>
                <span class="tag" data-value="路面">路面</span>
                <span class="tag" data-value="路标">路标</span>
                <span class="tag" data-value="路障">路障</span>
                <span class="tag" data-value="路灯">路灯</span>
                <span class="tag" data-value="灯柱">灯柱</span>
                <span class="tag" data-value="电线杆和电线">电线杆和电线</span>
                <span class="tag" data-value="长凳">长凳</span>
                <span class="tag" data-value="自动贩卖机">自动贩卖机</span>
                <span class="tag" data-value="摩天楼">摩天楼</span>
              </div>
            </div>
            
            <!-- 建筑 -->
            <div class="tags-category">
              <div class="category-title">建筑</div>
              <div class="tags-container" id="buildingTags">
                <span class="tag" data-value="建筑">建筑</span>
                <span class="tag" data-value="摩天楼">摩天楼</span>
                <span class="tag" data-value="东亚建筑">东亚建筑</span>
                <span class="tag" data-value="岛屿/神访">岛屿/神访</span>
                <span class="tag" data-value="大教堂">大教堂</span>
                <span class="tag" data-value="中式阁楼">中式阁楼</span>
                <span class="tag" data-value="传统中式客房">传统中式客房</span>
                <span class="tag" data-value="城堡">城堡</span>
                <span class="tag" data-value="塔楼">塔楼</span>
                <span class="tag" data-value="清真寺">清真寺</span>
                <span class="tag" data-value="水库">水库</span>
                <span class="tag" data-value="铁路">铁路</span>
                <span class="tag" data-value="桥">桥</span>
                <span class="tag" data-value="桥下">桥下</span>
                <span class="tag" data-value="迷途">迷途</span>
                <span class="tag" data-value="废墟堆">废墟堆</span>
                <span class="tag" data-value="建筑废墟">建筑废墟</span>
              </div>
            </div>
            
            <!-- 室内装饰 -->
            <div class="tags-category">
              <div class="category-title">室内装饰</div>
              <div class="tags-container" id="interiorTags">
                <span class="tag" data-value="室内泳池">室内泳池</span>
                <span class="tag" data-value="混合控制台">混合控制台</span>
                <span class="tag" data-value="汽车驾驶室内">汽车驾驶室内</span>
                <span class="tag" data-value="更衣室">更衣室</span>
                <span class="tag" data-value="在泳池边">在泳池边</span>
                <span class="tag" data-value="洗衣店">洗衣店</span>
                <span class="tag" data-value="在房间内">在房间内</span>
                <span class="tag" data-value="研究所">研究所</span>
                <span class="tag" data-value="灯笼环境">灯笼环境</span>
                <span class="tag" data-value="豪华房间内">豪华房间内</span>
                <span class="tag" data-value="厨房里">厨房里</span>
                <span class="tag" data-value="在床上">在床上</span>
                <span class="tag" data-value="在沙发上">在沙发上</span>
                <span class="tag" data-value="在桌子上">在桌子上</span>
                <span class="tag" data-value="在巴士内">在巴士内</span>
                <span class="tag" data-value="电车内">电车内</span>
                <span class="tag" data-value="咖啡厅">咖啡厅</span>
                <span class="tag" data-value="尿酒厅">尿酒厅</span>
                <span class="tag" data-value="宴会">宴会</span>
                <span class="tag" data-value="木质地板">木质地板</span>
                <span class="tag" data-value="榻榻米">榻榻米</span>
                <span class="tag" data-value="床">床</span>
                <span class="tag" data-value="沙发">沙发</span>
                <span class="tag" data-value="被炉">被炉</span>
                <span class="tag" data-value="壁炉">壁炉</span>
                <span class="tag" data-value="窗">窗</span>
                <span class="tag" data-value="窗帘">窗帘</span>
                <span class="tag" data-value="门">门</span>
                <span class="tag" data-value="推拉门">推拉门</span>
                <span class="tag" data-value="衣架">衣架</span>
                <span class="tag" data-value="空调">空调</span>
                <span class="tag" data-value="床单">床单</span>
                <span class="tag" data-value="床垫">床垫</span>
                <span class="tag" data-value="坐垫">坐垫</span>
                <span class="tag" data-value="抱枕">抱枕</span>
                <span class="tag" data-value="毛绒兔子">毛绒兔子</span>
                <span class="tag" data-value="小熊">小熊</span>
              </div>
            </div>
            
            <!-- 背景 -->
            <div class="tags-category">
              <div class="category-title">背景</div>
              <div class="tags-container" id="backgroundTags">
                <span class="tag" data-value="单色背景">单色背景</span>
                <span class="tag" data-value="简单的背景">简单的背景</span>
                <span class="tag" data-value="无背景|平铺的背景">无背景|平铺的背景</span>
                <span class="tag" data-value="黑色背景">黑色背景</span>
                <span class="tag" data-value="白色背景">白色背景</span>
                <span class="tag" data-value="透明背景">透明背景</span>
                <span class="tag" data-value="米色背景">米色背景</span>
                <span class="tag" data-value="棕色背景">棕色背景</span>
                <span class="tag" data-value="棕褐色背景">棕褐色背景</span>
                <span class="tag" data-value="灰色背景">灰色背景</span>
                <span class="tag" data-value="双色调背景">双色调背景</span>
                <span class="tag" data-value="渐变的背景">渐变的背景</span>
                <span class="tag" data-value="多彩的背景">多彩的背景</span>
                <span class="tag" data-value="彩虹背景">彩虹背景</span>
                <span class="tag" data-value="抽象背景">抽象背景</span>
                <span class="tag" data-value="美形背景">美形背景</span>
                <span class="tag" data-value="方格背景">方格背景</span>
                <span class="tag" data-value="花朵-点缀的背景">花朵-点缀的背景</span>
                <span class="tag" data-value="网点图背景">网点图背景</span>
                <span class="tag" data-value="桃色背景">桃色背景</span>
                <span class="tag" data-value="蜂窝风格背景">蜂窝风格背景</span>
                <span class="tag" data-value="格子呢背景">格子呢背景</span>
                <span class="tag" data-value="圆筒背景">圆筒背景</span>
              </div>
            </div>
            
            <!-- 自然景观 -->
            <div class="tags-category">
              <div class="category-title">自然景观</div>
              <div class="tags-container" id="naturalSceneryTags">
                <span class="tag" data-value="黄石国家公园">黄石国家公园</span>
                <span class="tag" data-value="大峡谷">大峡谷</span>
                <span class="tag" data-value="珠穆朗玛峰">珠穆朗玛峰</span>
                <span class="tag" data-value="大堡礁">大堡礁</span>
                <span class="tag" data-value="撒哈拉沙漠">撒哈拉沙漠</span>
                <span class="tag" data-value="亚马逊雨林">亚马逊雨林</span>
                <span class="tag" data-value="伊瓜苏大瀑布">伊瓜苏大瀑布</span>
                <span class="tag" data-value="维多利亚瀑布">维多利亚瀑布</span>
                <span class="tag" data-value="死海">死海</span>
                <span class="tag" data-value="科莫多国家公园">科莫多国家公园</span>
                <span class="tag" data-value="加拉帕戈斯群岛">加拉帕戈斯群岛</span>
                <span class="tag" data-value="乞力马扎罗山">乞力马扎罗山</span>
                <span class="tag" data-value="诺罗威国家公园">诺罗威国家公园</span>
                <span class="tag" data-value="巴厘岛">巴厘岛</span>
                <span class="tag" data-value="安第斯山脉">安第斯山脉</span>
                <span class="tag" data-value="摩洛哥蓝色小镇">摩洛哥蓝色小镇</span>
                <span class="tag" data-value="澳大利亚珊瑚海">澳大利亚珊瑚海</span>
                <span class="tag" data-value="阿尔卑斯山">阿尔卑斯山</span>
                <span class="tag" data-value="巴塔哥尼亚">巴塔哥尼亚</span>
                <span class="tag" data-value="哈里森湖洞穴">哈里森湖洞穴</span>
                <span class="tag" data-value="泰姬陵">泰姬陵</span>
                <span class="tag" data-value="尼亚加拉大瀑布">尼亚加拉大瀑布</span>
                <span class="tag" data-value="极光">极光</span>
                <span class="tag" data-value="喜马拉雅山脉">喜马拉雅山脉</span>
                <span class="tag" data-value="乌鲁鲁">乌鲁鲁</span>
                <span class="tag" data-value="黄金海岸">黄金海岸</span>
                <span class="tag" data-value="马尔代夫">马尔代夫</span>
                <span class="tag" data-value="马丘比丘">马丘比丘</span>
                <span class="tag" data-value="塞尔维亚的德里纳河">塞尔维亚的德里纳河</span>
              </div>
            </div>
            
            <!-- 人造景观 -->
            <div class="tags-category">
              <div class="category-title">人造景观</div>
              <div class="tags-container" id="manMadeSceneryTags">
                <span class="tag" data-value="万里长城">万里长城</span>
                <span class="tag" data-value="自由女神像">自由女神像</span>
                <span class="tag" data-value="埃菲尔铁塔">埃菲尔铁塔</span>
                <span class="tag" data-value="大本钟">大本钟</span>
                <span class="tag" data-value="白金汉宫">白金汉宫</span>
                <span class="tag" data-value="圣彼得大教堂">圣彼得大教堂</span>
                <span class="tag" data-value="金门桥">金门桥</span>
                <span class="tag" data-value="古罗马斗兽场">古罗马斗兽场</span>
                <span class="tag" data-value="悉尼歌剧院">悉尼歌剧院</span>
                <span class="tag" data-value="伦敦眼">伦敦眼</span>
                <span class="tag" data-value="京里噶林寺">京里噶林寺</span>
                <span class="tag" data-value="红场">红场</span>
                <span class="tag" data-value="莫斯科圣瓦西里大教堂">莫斯科圣瓦西里大教堂</span>
                <span class="tag" data-value="比萨斜塔">比萨斜塔</span>
                <span class="tag" data-value="户戸宫">户戸宫</span>
                <span class="tag" data-value="凡尔赛宫">凡尔赛宫</span>
                <span class="tag" data-value="尼斯湖">尼斯湖</span>
                <span class="tag" data-value="圣保罗大教堂">圣保罗大教堂</span>
                <span class="tag" data-value="埃及金字塔物流中心">埃及金字塔物流中心</span>
                <span class="tag" data-value="布拉格城堡">布拉格城堡</span>
                <span class="tag" data-value="新天鹅堡">新天鹅堡</span>
                <span class="tag" data-value="泰姬陵">泰姬陵</span>
                <span class="tag" data-value="马丘比丘">马丘比丘</span>
                <span class="tag" data-value="克里姆林宫">克里姆林宫</span>
                <span class="tag" data-value="巴比伦空中花园">巴比伦空中花园</span>
                <span class="tag" data-value="亚历山大灯塔">亚历山大灯塔</span>
                <span class="tag" data-value="苗族神话中的宙斯">苗族神话中的宙斯</span>
                <span class="tag" data-value="摩洛哥蓝色小镇">摩洛哥蓝色小镇</span>
                <span class="tag" data-value="阿尔罕布拉宫">阿尔罕布拉宫</span>
                <span class="tag" data-value="佩特拉古城">佩特拉古城</span>
                <span class="tag" data-value="布拉格天文钟">布拉格天文钟</span>
                <span class="tag" data-value="秦始皇兵马俑">秦始皇兵马俑</span>
                <span class="tag" data-value="埃及金字塔">埃及金字塔</span>
                <span class="tag" data-value="吉萨大金字塔">吉萨大金字塔</span>
                <span class="tag" data-value="斯芬克斯">斯芬克斯</span>
                <span class="tag" data-value="巴黎圣母院">巴黎圣母院</span>
                <span class="tag" data-value="威尼斯水城">威尼斯水城</span>
                <span class="tag" data-value="阿姆斯特丹运河">阿姆斯特丹运河</span>
                <span class="tag" data-value="巴塞罗那圣家堂">巴塞罗那圣家堂</span>
                <span class="tag" data-value="米兰大教堂">米兰大教堂</span>
                <span class="tag" data-value="维也纳国家歌剧院">维也纳国家歌剧院</span>
                <span class="tag" data-value="比利时布鲁日的布鲁日广场">比利时布鲁日的布鲁日广场</span>
                <span class="tag" data-value="希腊风车">希腊风车</span>
                <span class="tag" data-value="巴塞罗那那特区">巴塞罗那那特区</span>
                <span class="tag" data-value="佛罗伦萨大教堂">佛罗伦萨大教堂</span>
                <span class="tag" data-value="慕尼黑啤酒节">慕尼黑啤酒节</span>
                <span class="tag" data-value="巴黎马达兰">巴黎马达兰</span>
                <span class="tag" data-value="好莱坞标志">好莱坞标志</span>
                <span class="tag" data-value="帝国大厦">帝国大厦</span>
                <span class="tag" data-value="自然历史博物馆">自然历史博物馆</span>
                <span class="tag" data-value="史密森尼博物馆">史密森尼博物馆</span>
                <span class="tag" data-value="卢浮宫金字塔">卢浮宫金字塔</span>
                <span class="tag" data-value="迪士尼乐园">迪士尼乐园</span>
                <span class="tag" data-value="百老汇">百老汇</span>
                <span class="tag" data-value="时代广场">时代广场</span>
                <span class="tag" data-value="拉斯维加斯大道">拉斯维加斯大道</span>
                <span class="tag" data-value="旧金山唐人街">旧金山唐人街</span>
                <span class="tag" data-value="尼亚加拉瀑布">尼亚加拉瀑布</span>
                <span class="tag" data-value="青苔寮宫">青苔寮宫</span>
                <span class="tag" data-value="伦敦塔桥">伦敦塔桥</span>
                <span class="tag" data-value="圣马可广场">圣马可广场</span>
              </div>
            </div>
          </div>
          
          <!-- 已添加标签 -->
          <div class="tags-category-content" id="已添加">
            <div class="tags-category">
              
              <div class="active-tags-section" id="activeTags">
                <!-- 这里将通过JavaScript动态填充已激活的标签 -->
              </div>
            </div>
          </div>
        </div>
    `;
  }
};