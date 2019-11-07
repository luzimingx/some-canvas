<template>
<div class="home">
    <div class="home-banner">
        <img src="../assets/home.jpg" />
    </div>
</div>
</template>

<script>

export default {
  name: "home"
};
</script>

<style lang="less" scoped>
.home {
    &-banner {
        position: relative;
        padding: 28.1% 50%;
        > img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
        }
    }
}
</style>
