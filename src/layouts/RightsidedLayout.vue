<template lang="pug">
q-layout
  q-page-container
    q-page
      .row
        .col-12.col-sm-12.col-md-6.col-xl-6
          .gt-sm.coha--banner-wrapper
            .coha--banner
              .image(:style="{ backgroundImage: backgroundImage }")
              .text
        .col-12.col-sm-12.col-md-6.col-xl-6
          div(style="display: grid; grid-template-rows: 1fr auto; grid-template-columns: 100%;min-height: 100vh;")
            child
            Footer
</template>

<script>

import Footer from '@/components/FooterGuest'

export default {

  name: 'RightSidedLayout',

  components: {
    Footer
  },

  data () {
    return {
      backgroundImage: 'url(https://dreamteam-survey.s3.eu-central-1.amazonaws.com/images/student-2.jpg)'
    }
  },

  methods: {
  }

}
</script>

<style lang="scss" scoped>
.container.grid-list-md .layout .flex {
  padding: 0;
}

.coha--banner-wrapper {
  position: relative;
  max-height: 100vh;
  overflow: scroll;

  .coha--banner {
      overflow: hidden;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;

      position: fixed;
      left: 0;
      top: 0;
      height: 100%;
      width: 50vw;

      .image {
          // background-image: url('/storage/student-849825-1.jpg');
          position: absolute;
          left: 0;
          right: 0;
          margin: 0;
          top: 0;
          bottom: 0;
          background-position: 60% 70%;
          width: 100%;
          min-height: 31vw;
          height: 100vh;
          background-size: auto 110%;
          z-index: -1;
      }

      .text {
          text-align: center;
          color: #fff;
          font-size: 3rem;
      }
  }
}

</style>
