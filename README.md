# TodoApp Client

> 이 프로젝트는 [TodoMVC App Template](https://github.com/tastejs/todomvc-app-template/)을 기반으로 작성된 웹 클라이언트입니다.
>
> [Thymeleaf](https://www.thymeleaf.org/)와 [Vue.js](https://vuejs.org/)로 개발되었습니다.

<p align="center">
  <img width="640px" src=".README/todoapp_client.png">
</p>

[여기](http://todos-demo.ap-northeast-2.elasticbeanstalk.com/todos)에서 라이브 데모를 확인 할 수 있습니다.

## 클라이언트 기능

클라이언트는 다음과 같이 3개에 페이지로 구성되어있고, 페이지별로 필요한 기능이 내재되어 있습니다.

* **login.html** : 사용자 로그인을 위한 페이지로 HTML 폼(form) 전송을 통해 사용자 로그인을 시도합니다.
* **todos.html** : 할 일 관리 페이지로 AJAX를 사용해 [Web API](https://en.wikipedia.org/wiki/Web_API)를 호출하고, 결과를 출력합니다.
* **error.html** : 오류 페이지로 서버에서 제공된 모델에 담긴 오류 모델을 출력합니다.

### 공통
* 모든 페이지(html)는 Thymeleaf 형식으로 작성되었습니다.
* 모든 페이지 하단에는 사이트 작성자와 설명을 노출하는 기능이 포함되어 있습니다.
    - 서버에서 제공된 모델(Model)에 다음 키(Key)에 해당하는 값(Value)이 있으면 출력합니다.
        - `site.authour`: 사이트 작성자를 출력합니다.
        - `site.description`: 사이트 설명을 출력합니다.

### login.html
* 로그인 버튼을 클릭하면 `POST /login`로 사용자 입력 값(username, password)을 HTML 폼(form) 전송합니다.
* 서버에서 제공된 모델(Model)에 다음 키(Key)에 해당하는 값(Value)이 있으면 출력합니다.
    - `bindingResult`: [Spring BindingResult](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/validation/BindingResult.html) 개체에서 오류 내용을 출력합니다.
    - `message`: 서버에서 전달한 메시지가 있으면 출력합니다.

### todos.html
이 페이지는 Vue.js 로 작성된 [SPA](https://en.wikipedia.org/wiki/Single-page_application)가 적용되어 있으며, 동작하기 위해서는 Web API들이 필요합니다.

* 할 일 관리를 위해 아래 API를 사용합니다.
  - `GET /api/todos`: 할 일 목록 조회 또는 CSV 파일 다운로드
  - `POST /api/todos`: 새로운 할 일 등록
  - `PUT /api/todos/{todo.id}`: 등록된 할 일 수정 또는 완료
  - `DELETE /api/todos/{todo.id}`: 등록된 할 일 삭제
* `GET /api/feature-toggles`로 확장 기능을 활성화시킵니다.
* `GET /api/user/profile`로 로그인된 사용자 프로필 정보를 조회합니다.
* `POST /api/user/profile-picture`로 로그인된 사용자 프로필 이미지를 변경합니다.
* `GET /stream/online-users-counter`로 접속된 사용자 수 변경 이벤트를 받아 출력합니다.
  - 이벤트 스트림은 [EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)로 연결합니다.
* AJAX 호출에 대해 Http 상태코드(Status)가 오류일 때 응답 메시지로부터 오류 모델을 출력합니다.
  - error.html 에서 기대하는 오류 모델과 동일합니다.

> [Todoapp Web APIs Document](https://app.swaggerhub.com/apis-docs/code-rain/todoapp/1.0.0-snapshot)에서 API 스펙을 확인 할 수 있습니다.

### error.html
* 서버에서 제공된 모델(Model)에 다음 키(Key)에 해당하는 값(Value)이 있으면 출력합니다. 
  - `path`: 오류가 발생한 URL 경로(path)
  - `status`: HTTP 상태코드
  - `error`: 오류 발생 이유
    - `errors`: 스프링 BindingResult 내부에 모든 ObjectErrors 개체 목록
  - `message`: 오류 내용
  - `timestamp`: 오류 발생시간

## 프로젝트 구성

[Thymeleaf](https://www.thymeleaf.org/)와 [Vue.js](https://vuejs.org/)을 사용해서 개발되었고, [Vue CLI 3](https://cli.vuejs.org/)로 관리되고 있습니다.

### 디렉렉토리 구조

```
├── dist
├── public
├── src
├── mock
├── babel.config.js
├── vue.config.js
├── package.json
└── yarn.lock
```

* **src**, **public** : 클라이언트 소스 코드
* **mock** : 클라이언트 개발시 사용된 Mock 서버, [json-server](https://github.com/typicode/json-server)로 구동
* **dist** : 빌드(`yarn build`) 명령을 통해 작성된 배포본

### 의존성 관리

패키지 관리는 [얀(yarn)](https://yarnpkg.com/en/)을 사용하며, `package.json` 파일에 클라이언트 개발에 사용된 의존성이 선언되어 있습니다.

### 프로젝트 설정
```
yarn install
```

## 참고자료     

* [TodoMVC App Template](https://github.com/tastejs/todomvc-app-template/)

## 라이선스(License)

이 저장소내 모든 내용은 [MIT 라이선스](https://en.wikipedia.org/wiki/MIT_License)로 공개됩니다.
