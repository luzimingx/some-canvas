<template>
<div class="flex data-pick">
    <div class="flex-item-1 data-pick-canvas">
        <section class="data-pick-canvas-step">
            <h4 class="h4">
                Step 1：import a image
                <el-popover placement="right-start"
                    title="Cut image according to the red line before import"
                    width="376"
                    class="data-pick-canvas-example"
                    trigger="hover">
                    <img src="../assets/data-pick-example.jpg" class="data-pick-canvas-example-img">
                    <span slot="reference" class="scon scon-info"></span>
                </el-popover>
            </h4>
            <canvas class="data-pick-canvas-el"
                :class="{ 'drawed': hasDraw }"
                ref="canvas"
                width="440"
                height="440">
            </canvas>
            <div>
                <input type="file" class="data-pick-canvas-file" id="canvasFile" @change="importPic" />
                <label for="canvasFile" class="el-button el-button--success">选择文件</label>
            </div>
        </section>
        <section class="data-pick-canvas-step">
            <h4 class="h4">Step2：input coordinate</h4>
            <el-form label-width="100px">
                <el-form-item label="x轴起始坐标">
                    <el-input type="number" v-model="xp.start"></el-input>
                </el-form-item>
                <el-form-item label="x轴结束坐标">
                    <el-input type="number" v-model="xp.end"></el-input>
                </el-form-item>
                <el-form-item label="x轴刻度">
                    <el-input type="number" v-model="xp.scale"></el-input>
                </el-form-item>
                <el-form-item label="y轴起始坐标">
                    <el-input type="number" v-model="yp.start"></el-input>
                </el-form-item>
                <el-form-item label="y轴结束坐标">
                    <el-input type="number" v-model="yp.end"></el-input>
                </el-form-item>
                <el-form-item label="y轴刻度">
                    <el-input type="number" v-model="yp.scale"></el-input>
                </el-form-item>
                <div class="btn_box">
                    <el-button type="success" @click="drawGrid">增加栅格</el-button>
                    <el-button type="danger" @click="deleteGrid">删除栅格</el-button>
                </div>
            </el-form>
        </section>
    </div>
    <div class="flex-item-1 data-pick-result">
        <div v-if="hasDraw" class="data-pick-result-current">
            当前坐标: <span v-if="currentResult" class="data-pick-result-num">{{ currentResult.x + ' , ' + currentResult.y}}</span>
        </div>
        <template v-if="results.length">
            <el-table id="resultTable"
                :data="results"
                stripe
                style="width: 100%"
                height="794"
                class="data-pick-result-table">
                <el-table-column align="center" prop="serial" label="序号" width="90">
                    <template slot-scope="scope">
                        <span>{{ scope.$index + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="x" label="X" width="120"></el-table-column>
                <el-table-column align="center" prop="y" label="Y" width="120"></el-table-column>
                <el-table-column align="center" prop="action" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="deleteData(scope.$index)" type="danger" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="data-pick-result-btns">
                <el-button @click="exportData" type="success">导出数据</el-button>
                <el-button @click="clearData" type="danger">清除数据</el-button>
            </div>
        </template>
    </div>
</div>
</template>
<script>
import XLSX from 'xlsx';
import FileSaver from 'file-saver'

export default {
    name: 'data-pick',
    data() {
        return {
            canvas: null,
            ctx: null,
            xp: {
                start: 0,
                end: 7.5,
                scale: 0.5
            },
            yp: {
                start: 0,
                end: 15,
                scale: 1
            },
            img: new Image(),
            width: 400,
            height: 400,
            whiteSpace: 20,
            ajust: 0,
            hasDraw: false,
            currentResult: null,
            results: [],
            idTmr: null
        }
    },
    mounted() {
        this.init();
        this.addListeners();
    },
    methods: {
        init() {
            this.canvas = this.$refs.canvas;
            this.ctx = this.canvas.getContext('2d');
        },
        addListeners() {
            const { width, height, whiteSpace, ajust } = this;
            this.canvas.addEventListener('mousemove', e => {
                if (!this.hasDraw) return;
                // 转换成所需要的坐标系坐标值
                let location = this.getLocation(e.clientX, e.clientY);
                // ctx.clearRect(whiteSpace,whiteSpace,width,height);
                // ctx.drawImage(img,whiteSpace, whiteSpace,width,height);
                this.drawGrid();
                if(location.y > whiteSpace && location.y < height + whiteSpace){
                    this.drawLeverLine(location.y);
                }
                if(location.x > whiteSpace && location.x < width + whiteSpace){
                    this.drawVertialLine(location.x);
                }
                location.x -= whiteSpace;
                location.y -= whiteSpace;
                location.x = Number(this.xp.start + location.x * (this.xp.end - this.xp.start) / width).toFixed(2);
                location.y = Number(this.yp.end - location.y * (this.yp.end - this.yp.start) / height).toFixed(2);
                this.currentResult = { x: location.x, y: location.y};
            });
            // 监听鼠标点击存储数据
            this.canvas.addEventListener('click', () => {
                this.saveData();
            });
        },
        getLocation(x, y) {
            let bbox = this.canvas.getBoundingClientRect();
            return {
                x: (x - bbox.left) * (this.canvas.width / bbox.width),
                y: (y - bbox.top) * (this.canvas.height / bbox.height)
            }
        },
        drawLeverLine(y){
            const { ctx, width, whiteSpace } = this;
            ctx.beginPath();
            ctx.strokeStyle = 'red';
            ctx.moveTo(whiteSpace, y);
            ctx.lineTo(width + whiteSpace, y);
            ctx.closePath();
            ctx.stroke();
        },
        drawVertialLine(x){
            const { ctx, height, whiteSpace } = this;
            ctx.beginPath();
            ctx.moveTo(x, whiteSpace);
            ctx.lineTo(x, height + whiteSpace);
            ctx.closePath();
            ctx.stroke();
        },
        importPic(e) {
            let _this = this,
                fileReader = new FileReader();
            const { ctx, width, height, whiteSpace, ajust } = this;
            fileReader.readAsDataURL(e.target.files[0]);
            fileReader.onload = function(e){
                let result = e.target.result;   //返回的dataURL
                _this.img.src = result;
                _this.img.onload = function(){
                    _this.ctx.clearRect(0, 0, width + whiteSpace * 2, height + whiteSpace * 2);
                    _this.ctx.drawImage(_this.img, whiteSpace, whiteSpace, width, height);
                    _this.results = [];
                    _this.hasDraw = false;
                }
            }
        },
        drawGrid() {
            const { width, height, whiteSpace, ajust } = this;
            this.ctx.clearRect(0, 0, width + whiteSpace * 2, height + whiteSpace * 2);
            this.ctx.drawImage(this.img, whiteSpace, whiteSpace, width, height);
            this.ctx.beginPath();
            this.ctx.strokeStyle = '#999';
            let levelNumber = (this.xp.end - this.xp.start) / this.xp.scale;
            let verticalNumber = (this.yp.end - this.yp.start) / this.yp.scale;
            for(let i = 0; i <= verticalNumber; i++){
                this.ctx.moveTo(whiteSpace, height / verticalNumber * i + whiteSpace + ajust);
                this.ctx.lineTo(width + whiteSpace, height / verticalNumber * i + whiteSpace + this.ajust);
                this.ctx.fillText(Number(this.yp.end - this.yp.scale * i).toFixed(2), 0, height / verticalNumber * i + 3 + whiteSpace + ajust);
            }
            for(let j = 0;j <= levelNumber; j++){
                // 竖线从左到右画
                // ctx.moveTo(width/levelNumber*j+whiteSpace+ajust,height+whiteSpace);
                // ctx.lineTo(width/levelNumber*j+whiteSpace+ajust,whiteSpace);
                // ctx.fillText(Number(xp.start+xp.scale*j).toFixed(2),width/levelNumber*j+whiteSpace-12+ajust,height+32);
                // 竖线从右到左画
                this.ctx.moveTo(width - width / levelNumber * j + whiteSpace + ajust, height + whiteSpace);
                this.ctx.lineTo(width - width / levelNumber * j + whiteSpace + ajust, whiteSpace);
                this.ctx.fillText(Number(this.xp.end - this.xp.scale * j).toFixed(2), width - width / levelNumber * j + whiteSpace + ajust - 12, height + whiteSpace + 12);
            }
            this.ctx.closePath();
            this.ctx.stroke();
            this.hasDraw = true;
        },
        deleteGrid() {
            const { width, height, whiteSpace, ajust } = this;
            this.ctx.clearRect(whiteSpace, whiteSpace, width, height);
            this.ctx.drawImage(this.img, whiteSpace, whiteSpace, width, height);
        },
        saveData(){
            if (!this.hasDraw) return;
            this.results.push({
                x: this.currentResult.x,
                y: this.currentResult.y
            });
        },
        deleteData(index){
            this.results.splice(index, 1);
        },
        // 清除全部数据
        clearData() {
            this.results = [];
        },
        exportData() {
            let xlsxParam = { raw: true }; // 导出的内容只做解析，不进行格式转换
            let wb = XLSX.utils.table_to_book(document.querySelector('#resultTable'), xlsxParam);

            /* get binary string as output */
            let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
            try {
                FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'data.xlsx');
            } catch (e) {
                console.log(e, wbout);
            }
            return wbout;
        }
    }
};

</script>
<style lang="less" scoped>
@import (reference) '../less/base.less';

.data-pick {
    margin: 16px 24px;
    border: @borderBase;
    border-style: dashed;
    .h4 {
        margin: 0 0 6px;
    }
    &-canvas {
        padding: 24px;
        border-right: @borderBase;
        border-color: #ddd;
        &-step + &-step {
            margin-top: 20px;
        }
        &-example {
            &-img {
                width: 100%;
            }
            .scon-info {
                color: @colorTextAid;
                cursor: pointer;
            }
        }
        &-el {
            border: @borderBase;
            border-style: dotted;
            &.drawed {
                border-style: hidden;
            }
        }
        &-file {
            display: none;
        }
        .el-form-item {
            margin-bottom: 8px;
        }
    }
    &-result {
        padding: 24px;
        text-align: left;
        &-current {
            margin-bottom: 24px;
        }
        &-num {
            color: @colorHightLight;
        }
        &-table {
            max-width: 560px;
        }
        &-btns {
            margin-top: 10px;
        }
    }

}

</style>
