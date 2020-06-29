const mixins = {

  methods: {

    // Api URL
    apiUrl: (path) => {
      return process.env.API_DOMAIN + path
    }
  }
}

export default mixins
