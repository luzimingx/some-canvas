<template>
<div id="app">
    <Header></Header>
    <router-view/>
</div>
</template>

<script>
import Header from "./components/Header.vue";

export default {
    name: "app",
    components: {
        Header
    }
};
</script>

<style lang="less">
@import (reference) "./less/base.less";

html, body {
    margin: 0;
    padding: 0;
    min-width: @layoutWidth;
    background-color: #ededed;
}
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: @colorText;
    padding-top: 52px;
}
</style>
