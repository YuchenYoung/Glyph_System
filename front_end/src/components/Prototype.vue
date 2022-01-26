<template>
  <div style="width: 100%; text-align: center">
    <div id="upData" style="text-align: center; width: 80%; margin-left: 10%">
      <h2>Data Upload</h2>
      <el-button v-if="false" @click="testData">Test Data</el-button>
      <el-upload
        class="upload-demo"
        drag
        :limit="1"
        action=""
        accept=".csv, .xls, .xlsx"
        :before-upload="readCsvFile"
        v-show="up_data_display"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <div v-show="table_display" style="margin-top: 20px">
        <el-table :data="table_data" border height="300px" style="width: 100%">
          <el-table-column prop="model" label="model"> </el-table-column>
          <el-table-column prop="year" label="year"> </el-table-column>
          <el-table-column prop="price" label="price"> </el-table-column>
          <el-table-column prop="transmission" label="transmission">
          </el-table-column>
          <el-table-column prop="mileage" label="mileage"> </el-table-column>
          <el-table-column prop="fuelType" label="fuelType"> </el-table-column>
          <el-table-column prop="tax" label="tax"> </el-table-column>
          <el-table-column prop="mpg" label="mpg"> </el-table-column>
          <el-table-column prop="engineSize" label="engineSize">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-divider></el-divider>
    <div id="upImage" style="text-align: center">
      <h2>Image Upload</h2>
      <el-button v-if="false" @click="testData">Test Data</el-button>
      <div v-if="false">
        <p>line 1</p>
        <p>line 2</p>
      </div>
      <el-upload
        class="upload-demo"
        drag
        :limit="1"
        action=""
        accept=".jpg, .png"
        :before-upload="readImgFile"
        v-show="up_img_display"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <ul v-show="svg_display">
        <li
          v-for="item in svg_list"
          :key="item"
          v-html="item"
          :style="svg_style"
        ></li>
      </ul>
    </div>
    <el-divider></el-divider>
    <div
      id="visD3"
      style="text-align: center"
      v-show="table_display && svg_display"
    >
      <h2>Visualization</h2>
      <el-button v-show="!vis_display" @click="generateVis"
        >Generate Visualization</el-button
      >
      <svg
        v-show="vis_display"
        width="1500"
        height="700"
        id="mainsvg"
        class="svgs"
      ></svg>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  name: "UpImage",
  props: {},
  data() {
    return {
      table_display: false,
      up_data_display: true,
      table_data: [],
      up_img_display: true,
      svg_display: false,
      svg_list: [],
      svg_style: {
        width: "0",
        height: "0",
      },
      svg_width: 0,
      svg_height: 0,
      path_attrs: {
        stroke: "none",
        fill: "black",
        "fill-rule": "evenodd",
      },
      d_list: [],
      path_size: [],
      vis_display: false,
    };
  },
  mounted() {
    this.testD3();
  },
  methods: {
    testData() {
      console.log("test");
    },
    testD3() {
      let p = d3.select("body").selectAll("p").text("hello");
      p.style("color", "#f03").style("font-size", "30px");
    },
    readCsvFile(obj) {
      const reader = new FileReader();
      const _this = this;
      reader.readAsArrayBuffer(obj);
      reader.onload = () => {
        const buffer = reader.result;
        const bytes = new Uint8Array(buffer);
        const length = bytes.byteLength;
        let binary = "";
        for (let i = 0; i < length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const XLSX = require("xlsx");
        const wb = XLSX.read(binary, {
          type: "binary",
        });
        const outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        let tmp_data = [...outdata];
        _this.table_display = true;
        _this.up_data_display = false;
        _this.table_data = tmp_data;
      };
      return false;
    },
    readImgFile(file) {
      const _this = this;
      const potrace = require("potrace");
      let trace = new potrace.Potrace();
      let cur_src = URL.createObjectURL(file);
      trace.loadImage(cur_src, (err) => {
        if (err) throw err;
        let res_svg = trace.getSVG();
        _this.separateSvgComponents(res_svg.toString());
        _this.up_img_display = false;
        _this.svg_display = true;
      });
      return false;
    },
    separateSvgComponents(src) {
      const _this = this;
      let mid_st_str = `<path d="`;
      let mid_start = src.indexOf(mid_st_str) + mid_st_str.length;
      let head = src.substring(0, mid_start);
      _this.svg_style.width = head.split(`width="`)[1].split(`"`)[0] + "px";
      _this.svg_style.height = head.split(`height="`)[1].split(`"`)[0] + "px";
      _this.svg_width = +head.split(`width="`)[1].split(`"`)[0];
      _this.svg_height = +head.split(`height="`)[1].split(`"`)[0];
      src = src.substr(mid_start + 1);
      let mid_end = src.indexOf(`"`);
      let mid = src.substr(0, mid_end);
      let tail = src.substr(mid_end);
      mid.split("M").forEach((it) => {
        _this.svg_list.push(head + "M" + it + tail);
        _this.d_list.push("M" + it);
      });
      // TODO: using 'tail' to get paths' attributes and save them as _this.path_attr
    },
    getPathSize() {
      const path_list = document.getElementsByTagName("path");
      for (let i = 0; i < path_list.length; i++) {
        this.path_size.push(path_list[i].getBoundingClientRect())
      }
    },
    generateVis() {
      this.getPathSize();
      this.vis_display = true;
      const _this = this;
      const vis_svg = d3.select("#mainsvg");
      const vis_width = +vis_svg.attr("width");
      const vis_height = +vis_svg.attr("height");
      const margin = { top: 50, right: 100, bottom: 50, left: 100 };
      const inner_width = vis_width - margin.left - margin.right;
      const inner_height = vis_height - margin.top - margin.bottom;
      const g = vis_svg
        .append("g")
        .attr("id", "maingroup")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
      const xValue = (datum) => {
        return datum.year;
      };
      const yValue = (datum) => {
        return datum.mileage;
      };

      let xScale, yScale;
      let all_years;

      const render_init = (data) => {
        xScale = d3
          .scaleLinear()
          .domain([d3.min(data, xValue), d3.max(data, xValue)])
          .range([0, inner_width])
          .nice();
        yScale = d3
          .scaleLinear()
          .domain([d3.max(data, yValue), d3.min(data, yValue)])
          .range([0, inner_height])
          .nice();
        const xAxis = d3.axisBottom(xScale).tickSize(inner_height);
        g.append("g").call(xAxis);
        const yAxis = d3.axisLeft(yScale).tickSize(-inner_width);
        g.append("g").call(yAxis);
        g.selectAll(".tick text").attr("font-size", "1.5em");
      };

      const render = (data) => {
        let render_cnt = 0;
        console.log(data);
        const price_max = d3.max(data, (d) => d.price);
        const price_min = d3.min(data, (d) => d.price);
        let pie_tx, pie_ty = 0;
        data.forEach((it) => {
          ++render_cnt;
          const glyph = g.append("g").attr("class", "glyph");
          for (let i = 0; i < _this.d_list.length; i++) {
            if (i != 1) {
              const part = glyph.append("path").attr("d", _this.d_list[i]);
              if (i == 0) {
                const part_width = _this.path_size[i].width;
                const cur_scale = it.engineSize - 0.5
                part.attr("transform", `translate(${part_width * (1 - cur_scale)},0),scale(${cur_scale}, 1)`);
              }
            } else {
              pie_tx = _this.path_size[i].width * 0.5;
              pie_ty = _this.path_size[i].height * 0.5;
              glyph
                .append("clipPath")
                .attr("id", `clip-${render_cnt}`)
                .append("path")
                .attr("d", _this.d_list[i])
                .attr("transform",`translate(${-pie_tx},${-pie_ty})`);
            }
          }
          const pie = d3
            .pie()
            .sort(null)
            .value(function (d) {
              return d.value;
            });
          const pieColor = (id) => {
            const color_list = ["#ef4136", "#f58220", "#fcaf17"];
            return color_list[id % color_list.length];
          };
          const pie_data = pie([
            { value: it.manual },
            { value: it.semiAuto },
            { value: it.automatic },
          ]);
          const arc = d3.arc().innerRadius(0).outerRadius(Math.max(pie_tx, pie_ty));
          const pie_chart = glyph
            .append("g")
            .attr("class", "pie_area")
            .attr("clip-path", `url(#clip-${render_cnt})`)
            .attr("transform",`translate(${pie_tx},${pie_ty})`);
          pie_chart
            .selectAll("g")
            .data(pie_data)
            .enter()
            .append("path")
            .attr("fill", function (d, i) {
              return pieColor(i);
            })
            .attr("d", function (d) {
              return arc(d);
            });
          const scale = (it.price - price_min) / (price_max - price_min) + 0.5;
          const x_pos = xScale(it.year) - _this.svg_width * 0.5 * scale;
          const y_pos = yScale(it.mileage) - _this.svg_height * 0.5 * scale;
          glyph.attr(
            "transform",
            `translate(${x_pos},${y_pos}), scale(${scale},${scale})`
          );
        });
      };

      const raw_data = _this.table_data;

      all_years = Array.from(new Set(raw_data.map((d) => xValue(d))));
      all_years.sort();
      let year_data = [];
      let vis_data = [];
      for (let i = 0; i < all_years.length; i++) {
        year_data.push([]);
      }
      raw_data.forEach((it) => {
        year_data[all_years.indexOf(it.year)].push(it);
      });
      const mileage_part =
        (d3.max(raw_data, yValue) - d3.min(raw_data, yValue)) / 10;
      for (let i = 0; i < all_years.length; i++) {
        year_data[i].sort((a, b) => {
          return a.mileage - b.mileage;
        });
        const cur_mileage_min = d3.min(year_data[i], yValue);
        const cur_mileage_range =
          d3.max(year_data[i], yValue) - d3.min(year_data[i], yValue);
        const cur_mileage_sections = Math.max(
          1,
          parseInt(cur_mileage_range / mileage_part + 0.5)
        );
        const cur_mileage_part = cur_mileage_range / cur_mileage_sections;
        vis_data.push([]);
        for (let j = 0; j < cur_mileage_sections; j++) {
          vis_data[i].push({
            year: all_years[i],
            cnt: 0,
            mileage: 0,
            price: 0,
            engineSize: 0,
            automatic: 0,
            semiAuto: 0,
            manual: 0,
          });
        }
        year_data[i].forEach((it) => {
          let u = 0;
          if (cur_mileage_part > 0) {
            u = Math.min(
              cur_mileage_sections - 1,
              parseInt((it.mileage - cur_mileage_min) / cur_mileage_part)
            );
          }
          vis_data[i][u].cnt++;
          vis_data[i][u].mileage += it.mileage;
          vis_data[i][u].price += it.price;
          vis_data[i][u].engineSize += it.engineSize;
          if (it.transmission.trim() == "Manual") {
            vis_data[i][u].manual++;
          } else if (it.transmission.trim() == "Semi-Auto") {
            vis_data[i][u].semiAuto++;
          } else if (it.transmission.trim() == "Automatic") {
            vis_data[i][u].automatic++;
          }
        });
        for (let j = vis_data[i].length - 1; j >= 0; j--) {
          if (vis_data[i][j].cnt == 0) {
            vis_data[i].splice(j, 1);
          } else {
            vis_data[i][j].mileage /= vis_data[i][j].cnt;
            vis_data[i][j].price /= vis_data[i][j].cnt;
            vis_data[i][j].engineSize /= vis_data[i][j].cnt;
            vis_data[i][j].manual /= vis_data[i][j].cnt;
            vis_data[i][j].semiAuto /= vis_data[i][j].cnt;
            vis_data[i][j].automatic /= vis_data[i][j].cnt;
          }
        }
      }
      let glyph_data = [];
      vis_data.forEach((arr) => {
        arr.forEach((it) => {
          glyph_data.push(it);
        });
      });
      render_init(glyph_data);
      render(glyph_data);
    },
  },
};
</script>

<style lang="less">
.el-table td,
.el-table th {
  text-align: center !important;
  min-height: 32px;
}

.tick > line {
  stroke: #c0c0bb;
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
ul {
  list-style: none;
  padding: 0;
}

ul > li {
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #c0ccda;
  border-radius: 6px;
  box-sizing: border-box;
  margin: 0 8px 8px 0;
  display: inline-block;
}
</style>