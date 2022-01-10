<template lang="pug">
.rightsided-content
  .inner-content
    h1 {{ $t('welcome_heading') }}
    p(style='max-width: 400px;') {{ $t('welcome_text') }}
    div(style='max-width: 500px;')
      q-item-label.divider(header)
        span {{ $t('pan_and_pin') }}
      AuthPanel(
        :title="$t('pan_title')"
        :text="$t('pan_desc')"
        :route="'pan'"
        :color="'accent'"
        :icon="'mdi-dialpad'"
      )
      q-item-label.divider(header='')
        span {{ $t('with_email') }}
      AuthPanel(
        :title="$t('register')"
        :text="$t('register_desc')"
        :route="'register'"
        :color="'secondary'"
        :icon="'mdi-account-plus'"
      )
      AuthPanel(
        :title="$t('login')"
        :text="$t('login_desc')"
        :route="'login'"
        :color="'info'"
        :icon="'mdi-account'"
      )
</template>

<script>
import AuthPanel from '@/components/AuthPanel'

export default {

  middleware: 'guest',
  layout: 'RightsidedLayout',

  components: {
    AuthPanel
  }

}
</script>
