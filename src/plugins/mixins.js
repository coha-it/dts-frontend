const mixins = {

  methods: {

    // URL

    // Api URL
    apiUrl: (path) => {
      return process.env.VUE_APP_API_DOMAIN + path
    }
  }
}

export default mixins
