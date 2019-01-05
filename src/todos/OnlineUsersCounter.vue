<template>
  <div class="users-currently-count">
    <span class="count-text">{{ count }} users currently online</span>
  </div>
</template>

<script>
let eventSource = null

export default {
  data() {
    return {
      count: 0
    }
  },
  mounted() {
    this.subscribe()
  },
  props: {
    activity: {
      type: [String, Boolean], default: true
    }
  },
  watch: {
    activity: function() {
      this.subscribe();
    }
  },
  methods: {
    isActivity() {
      if (typeof this.activity === 'boolean') {
        return this.activity
      }
      return this.activity === 'true'
    },
    subscribe() {
      if (this.isActivity()) {
        if (eventSource) {
          eventSource.close()
        }

        const that = this
        eventSource = new EventSource('/stream/online-users-counter')
        eventSource.onmessage = function(event) {
            that.count = event.data ? event.data : 'unknown'
        }
        eventSource.onerror = function() {
          console.error('접속중인 사용자 수를 획득하지 못했습니다.')
        }
      }
    }
  }
}
</script>

<style>
.users-currently-count {
  float: left;
}
.count-text {
  font-size: inherit;
}
</style>