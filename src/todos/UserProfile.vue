<template>
  <div class="user-app">
    <p v-show="!authorized" class="auth-text">Please <a href="/login" class="auth-link">login</a> to write todos</p>
    <div v-show="authorized" class="user-profile">
        <img v-bind:src="user.profilePictureUrl">
        <p>Welcome your visit to {{ user.name }}</p>
        <div class="settings">
            <button type="button">&#9776;</button>
            <div class="buttons">
            <a @click="$refs.updateProfilePicture.click()" href="#">Update Profile Picture</a>
            <input ref="updateProfilePicture" @change="updateProfilePicture($event)" type="file" accept="image/*" class="input-file">
            <a href="/logout">Log Out</a>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import commons from '../commons'

const unknownUser = {
  name: 'Unknown',
  profilePictureUrl: '/assets/img/profile-picture.png'
}

export default {
  data() {
    return {
      authorized: false,
      user: Object.assign({}, unknownUser)
    }
  },
  mounted() {
    this.fetch()
  },
  methods: {
    fetch() {
      this.$http.get(`/api/user/profile`).then(response => {
        this.authorized = true
        this.user = Object.assign(this.user, response.data)
      }).catch(error => {
        this.authorized = false
        this.user = Object.assign({}, unknownUser)
        this.flashWarning(commons.getErrorMessage(error, '사용자 프로필을 획득하지 못했습니다.'))
      })
    },
    updateProfilePicture(event) {
      let formData = new FormData()
      formData.append('profilePicture', event.target.files[0])
      this.$http.post(`/api/user/profile-picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => {
        this.user = Object.assign(this.user, response.data)
      }).catch(error => {
        this.flashError(commons.getErrorMessage(error, '프로필 이미지 변경에 실패했습니다.'))
      })
    }
  }
}
</script>

<style>
.user-app {
  padding: 6px 8px;
  background: rgba(0, 0, 0, 0.003);
  -webkit-box-shadow: 0 2px 1px 0 rgba(0, 0, 0, 0.03);
  box-shadow: 0 2px 1px 0 rgba(0, 0, 0, 0.03);
  border-bottom: 1px solid #e6e6e6;
  position: relative;
}

.user-profile p {
  font-size: 1.1em;
  margin-left: 55px;
}
.user-profile img {
  position: absolute;
  margin-top: -10px;
  margin-left: 5px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center right;
}
.user-profile .settings {
  position: absolute;
  right: 0;
  top: 0;
  padding-top: 3px;
  padding-right: 8px;
}
.user-profile .settings button {
  border: none;
  cursor: pointer;
}
.user-profile .settings .buttons {
  display: none;
  position: absolute;
  right: 0;
  margin-right: 6px;
  padding: 4px 4px;
  min-width: 150px;
  background-color: #ffffff;
  border: 1px solid #e6e6e6;
  text-align: right;
  z-index: 1;
}
.user-profile .settings:hover .buttons {
  display: block;
}
.user-profile .settings .buttons a {
  color: #4d4d4d;
  font-size: 0.9em;
  line-height: 18px;
  text-decoration: none;
  display: block;
  padding: 2px 4px;
}
.user-profile .settings .buttons a:hover {
  font-weight: 400;
}
.user-profile .input-file {
  display: none;
}
</style>