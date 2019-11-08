<template>
<div class="flex flex-middle app-header">
    <img src="@/assets/logo.png" alt="logo" class="app-header-logo">
    <div class="flex app-header-link-con">
        <router-link :to="{ name: 'data-pick' }" class="app-header-link">DatePick</router-link>
        <router-link :to="{ name: 'home' }" class="app-header-link">Home</router-link>
    </div>
</div>
</template>

<script>
export default {
    name: "Header",
    props: {
        activeIndex: 1
    }
};
</script>

<style scoped lang="less">
@import (reference) '../less/base.less';

.app-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 99;
    padding: 9px 20px;
    box-sizing: border-box;
    min-width: @layoutWidth;
    background-image: linear-gradient(90deg,#222325,#3b3c3f,#222325);
    &-logo {
        width: 18px;
        height: $width;
        border-radius: 50%;
        margin-right: 20px;
    }
    &-link-con {
        flex: 1;
        flex-direction: row-reverse;
        margin-right: 80px;
    }
    &-link {
        color: fade(@white, 70);
        text-decoration: none;
        padding: 6px 16px;
        &.router-link-exact-active {
            color: @white;
            text-shadow: .5px .5px 2px @white;
        }
        &:first-child {
            padding-right: 0;
        }
    }
}
</style>
