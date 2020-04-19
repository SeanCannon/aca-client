<template>
  <div>
    <div class="cropper-container" v-show="isCropping">
      <button v-show="!fileLoaded" @click="tryAgain">Upload an Image File</button>
      <div class="outercropper"><Cropper :src="dataurl" :stencilProps="{aspectRatio: getAspectRatio()}" :defaultPositon="defPos" :defaultSize="defSize" ref="cropper" @change="onCrop" /></div>
      <div class="buttons">
        <button @click="toggleView()">Next</button>
      </div>
    </div>
    <input v-show="false" type="file" ref="files" accept="image/*" @change="onFile" />
    <div class="preview-and-options" v-show="!isCropping">
      <h3>Please select your conversion type.</h3>
      <div class="preview">
        <canvas v-show="false" ref="preview" />
        <canvas v-show="false" ref="postview" width="64" height="64" />
        <canvas ref="postmix" class="postview" width="256" height="256" />
      </div>
      <div class="buttons">
        <button @click="toggleView()">Edit Crop</button>
        <button @click="$emit('converted', outputs)">Convert!</button>
      </div>
    </div>
  </div>
</template>

<script>
import logger from "/utils/logger";
import { Cropper } from 'vue-advanced-cropper'
import DrawingTool from '/libs/DrawingTool';

export default {
  name: "ImageLoader",
  components:{
    Cropper
  },
  props:{
    patternType: Number,
  },
  data: function() {
    return {
      dataurl: "",
      convert_method: "quantize",
      convert_quality: "high",
      convert_trans: 50,
      convert_samepal: false,
      draw: new DrawingTool(),
      isCropping: true,
      fileLoaded: false,
      fileName: "",
      muralWide: 1,
      muralTall: 1,
      outputs: []
    };
  },
  mounted(){
    this.draw.patternType = this.patternType;
    this.draw.addCanvas(this.$refs.postview);
    if (localStorage.getItem("author_acnl")){
      this.draw.authorStrict = localStorage.getItem("author_acnl");
    }
    this.$refs.files.click();
  },
  methods: {
    defPos(opt){
      return {top:0, left:0};
    },
    defSize(opt){
      return {height:opt.imageHeight, width:opt.imageWidth};
    },
    onCrop({coordinates, canvas}){
      if (!(canvas instanceof HTMLCanvasElement)){return;}
      this.outputs = [];
      const iSize = this.draw.width;
      let oSize = this.draw.width;
      const pattAspect = this.muralWide/this.muralTall;
      if (pattAspect < 1){
        while (oSize*this.muralTall < 256){oSize += 32;}
      }else{
        while (oSize*this.muralWide < 256){oSize += 32;}
      }

      this.$refs.preview.width = iSize*this.muralWide;
      this.$refs.preview.height = iSize*this.muralTall;
      this.$refs.postmix.width = oSize*this.muralWide;
      this.$refs.postmix.height = oSize*this.muralTall;
      const pmCtx = this.$refs.postmix.getContext('2d');
      pmCtx.imageSmoothingEnabled = false;


      const ctx = this.$refs.preview.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = this.convert_quality;
      ctx.drawImage(canvas, 0, 0,iSize*this.muralWide, iSize*this.muralTall);


      if (this.convert_samepal){
        const imgdata = ctx.getImageData(0, 0, iSize*this.muralWide, iSize*this.muralTall);
        switch (this.convert_method){
          case "quantize": this.image_quantize(imgdata); break;
          case "rgb": this.image_rgb(imgdata); break;
          case "yuv": this.image_yuv(imgdata); break;
          case "grey": this.image_grey(imgdata); break;
          case "sepia": this.image_sepia(imgdata); break;
          case "keep": this.image_keep(imgdata); break;
          case "lowest": this.image_lowestdistance(imgdata); break;
        }
      }

      const imgdata = ctx.getImageData(iSize*x, iSize*y, iSize, iSize);

      this.image_quantize(imgdata);


      const pixelCount = this.draw.pixelCount*4;
      for (let i = 0; i < pixelCount; i+=4){
        let x = (i >> 2) % iSize;
        let y = Math.floor((i >> 2) / iSize);
        if (imgdata.data[i+3] < this.convert_trans*2.55){
          this.draw.setPixel(x, y, 15);
        }else{
          this.draw.setPixel(x, y, [imgdata.data[i], imgdata.data[i+1], imgdata.data[i+2]]);
        }
      }
      this.draw.title = this.fileName.substring(0, 16)+" "+(x+1)+"x"+(y+1);
      this.draw.onLoad();
      this.outputs.push(this.draw.toString());


      pmCtx.drawImage(this.$refs.postview, 0, 0, 64, 64, oSize*x, oSize*y, oSize, oSize);
    },

    image_rgb(imgdata){
      let palette = [];
      for (let i = 0; i < 256; i++){palette.push({n: i, c:0});}
      const pixelCount = imgdata.data.length;
      for (let i = 0; i < pixelCount; i+=4){
        if (imgdata.data[i+3] < this.convert_trans*2.55){continue;}
        palette[this.draw.findRGB([imgdata.data[i], imgdata.data[i+1], imgdata.data[i+2]])].c++;
      }
      palette.sort((a, b) => {
        if (a.c > b.c){return -1;}
        if (a.c < b.c){return 1;}
        return 0;
      });
      for (let i = 0; i < 15; i++){this.draw.setPalette(i, palette[i].n);}
    },

    image_yuv(imgdata){
      let palette = [];
      for (let i = 0; i < 256; i++){palette.push({n: i, c:0});}
      const pixelCount = imgdata.data.length;
      for (let i = 0; i < pixelCount; i+=4){
        if (imgdata.data[i+3] < this.convert_trans*2.55){continue;}
        palette[this.draw.findYUV([imgdata.data[i], imgdata.data[i+1], imgdata.data[i+2]])].c++;
      }
      palette.sort(function(a, b){
        if (a.c > b.c){return -1;}
        if (a.c < b.c){return 1;}
        return 0;
      });
      for (let i = 0; i < 15; i++){this.draw.setPalette(i, palette[i].n);}
    },


    image_quantize(imgdata){
      const pixelCount = imgdata.data.length;
      let pixels = [];
      for (let i = 0; i < pixelCount; i+=4){
        if (imgdata.data[i+3] < this.convert_trans*2.55){continue;}
        pixels.push({r:imgdata.data[i], g:imgdata.data[i+1], b:imgdata.data[i+2]});
      }
      const medianCut = (pixels) => {
        let l = Math.floor(pixels.length/2);
        let r_min = null; let r_max = null;
        let g_min = null; let g_max = null;
        let b_min = null; let b_max = null;
        for (let i in pixels){
          if (pixels[i].r < r_min || r_min === null){r_min = pixels[i].r;}
          if (pixels[i].r > r_max || r_max === null){r_max = pixels[i].r;}
          if (pixels[i].g < g_min || g_min === null){g_min = pixels[i].g;}
          if (pixels[i].g > g_max || g_max === null){g_max = pixels[i].g;}
          if (pixels[i].b < b_min || b_min === null){b_min = pixels[i].b;}
          if (pixels[i].b > b_max || b_max === null){b_max = pixels[i].b;}
        }
        let r_dist = r_max-r_min;
        let g_dist = g_max-g_min;
        let b_dist = b_max-b_min;
        if (r_dist >= g_dist && r_dist >= b_dist){

          pixels.sort((a,b)=>(a.r-b.r));
        }else if(g_dist >= r_dist && g_dist >= b_dist){

          pixels.sort((a,b)=>(a.g-b.g));
        }else{

          pixels.sort((a,b)=>(a.b-b.b));
        }
        return [pixels.slice(0, l),pixels.slice(l)];
      };
      const medianMultiCut = (buckets) => {
        let res = [];
        for (let i in buckets){
          const newBuck = medianCut(buckets[i]);
          if (newBuck[0].length){res.push(newBuck[0]);}
          if (newBuck[1].length){res.push(newBuck[1]);}
        }
        return res;
      };
      let buckets = medianCut(pixels);
      buckets = medianMultiCut(buckets);
      buckets = medianMultiCut(buckets);
      buckets = medianMultiCut(buckets);


      let colors = [];
      let uniqCol = new Set();


      const pushAvg = (b) => {
        let r_avg = 0;
        let g_avg = 0;
        let b_avg = 0;
        for (let i in b){
          r_avg += b[i].r;
          g_avg += b[i].g;
          b_avg += b[i].b;
        }
        let rgb = [Math.round(r_avg/b.length), Math.round(g_avg/b.length), Math.round(b_avg/b.length)];
        let idx = this.draw.findRGB(rgb);
        if (!uniqCol.has(idx)){
          colors.push(idx);
          uniqCol.add(idx);
        }
      };


      for (let i in buckets){pushAvg(buckets[i]);}
      logger.info("Unique colors: "+uniqCol.size);

      if (uniqCol.size < 15){

        buckets = medianMultiCut(buckets);
        for (let i in buckets){pushAvg(buckets[i]);}
        logger.info("Unique colors after further quantize: "+uniqCol.size);
        if (uniqCol.size < 15){
          buckets = medianMultiCut(buckets);
          for (let i in buckets){pushAvg(buckets[i]);}
          logger.info("Unique colors after further quantize: "+uniqCol.size);
          if (uniqCol.size < 15){
            buckets = medianMultiCut(buckets);
            for (let i in buckets){pushAvg(buckets[i]);}
            logger.info("Unique colors after further quantize: "+uniqCol.size);
          }
        }
      }else if (uniqCol.size > 15){


        let minDist = 255*255*3;
        let bucketA = null;
        let bucketB = null;
        for (let i in colors){
          for (let j in colors){
            if (i >= j){continue;}
            let rD = (colors[i][0] - colors[j][0]);
            let gD = (colors[i][1] - colors[j][1]);
            let bD = (colors[i][2] - colors[j][2]);
            let match = (rD*rD + gD*gD + bD*bD);
            if (match < minDist || bucketA===null){
              minDist = match;
              bucketA = i;
              bucketB = j;
            }
          }
        }

        let bucketC = buckets[bucketA].concat(buckets[bucketB]);
        colors.splice(bucketB);
        colors.splice(bucketA);
        pushAvg(bucketC);
        uniqCol = new Set(colors);
        logger.info("Unique colors after merge of closest two: "+uniqCol.size);
      }


      let cNum = 0;
      for (let c of uniqCol){
        if (cNum > 14){break;}
        logger.info("Setting color "+cNum+" to "+c);
        this.draw.setPalette(cNum, c);
        cNum++;
      }
    },

    onFile: async function(e) {
      this.dataurl = await new Promise((resolve, reject) => {
        let fr = new FileReader();
        fr.onerror = () => {
          fr.abort();
          reject(new DOMException("Problem parsing input file."));
        };
        fr.onload = (re) => {resolve(re.target.result);};
        this.fileName = e.target.files[0].name;
        fr.readAsDataURL(e.target.files[0]);
      });
      this.fileLoaded = true;
    },
    toggleView(){
      this.isCropping = !this.isCropping;
    },
    tryAgain(){
      this.$refs.files.click();
    },
    getAspectRatio() {
      return this.muralWide/this.muralTall;
    }
  }
}
</script>

<style lang="scss" scoped>
  button {
    border-radius: 35px;
    text-transform: uppercase;
    padding: 10px 14px;
    border: none;
    background-color: #00B6A7;
    color: #ffffff;
    box-shadow: rgba(0,0,0,0.2) 0 0 8px;
    cursor: pointer;
    font-weight: 800;
  }
  canvas {
    border: 1px solid gray;
  }
  .cropper-container, .preview-and-options {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    min-height: 400px;
    color: #ffffff;
  }
  .cropper-container.hidden, .preview-and-options.hidden {
    display: none;
  }
  .cropper-container Cropper{
    width: 50%;
    height: 50%;
  }
  .cropper-container button {
    margin: 20px 0 0 0;
  }
  .preview-and-options .preview {
    display: flex;
    align-items: flex-start;
  }
  .preview-and-options .options {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-left: 20px;
  }
  .preview-and-options .options li{
    cursor: pointer;
    padding: 10px;
    min-width: 200px;
  }
  .preview-and-options .options li.active {
    background-color: teal;
    border-radius: 20px;
  }
  .preview-and-options .buttons {
    display: flex;
    justify-content: space-between;
    min-width: 220px;
  }
  .outercropper{
    width:400px;
    height:400px;
  }
  .postview{
    background: repeating-linear-gradient(-45deg, #ddd, #ddd 5px, #fff 5px, #fff 10px);
  }


  .muralInputArea {
    display: flex;
    flex-direction: row;
    width: 100%;
    align-content: space-between;
  }

  .muralInputColumn {
    flex: 50%;
    flex-direction: column;
    align-content: space-between;
    text-align: center;
  }

  .muralInputColumn * {
    text-align: center;
    width: 60%;
  }
</style>
