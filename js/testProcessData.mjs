export default {
  //最顶层必须是一个串行任务
  "taskType": 0, //0是 串行任务 2是并行任务
  "subTasks": [{
    "taskType": 0,
    "subTasks": null,
    "state": 10,
    "taskName": "串行任务11",
    "assignees": [{
      "nickname": "执行人11"
    }],
  }, {
    "taskType": 2,
    "subTasks": [{
        "taskType": 0,
        "subTasks": [{
          "taskType": 0,
          "subTasks": null,
          "state": 10,
          "taskName": "串并行任务211",
          "assignees": [{
            "nickname": "执行人211"
          }],
        }, {
          "taskType": 2,
          "subTasks": [{
            "taskType": 0,
            "taskName": "串并行任务2121",
            "subTasks": null,
            "state": 10,
            "assignees": [{
              "nickname": "执行人2121"
            }],
          }, {
            "taskType": 0,
            "taskName": "串并行任务2122",
            "subTasks": null,
            "state": 20,
            "assignees": [{
              "nickname": "执行人2122"
            }],
          }],
        }, {
          "taskType": 0,
          "taskName": "串并行任务213",
          "subTasks": null,
          "state": 30,
          "assignees": [{
            "nickname": "执行人213"
          }],
        }],
      },
      {
        "taskType": 0,
        "subTasks": [{
          "taskType": 0,
          "taskName": "并行任务221",
          "subTasks": null,
          "state": 10,
          "assignees": [{
            "nickname": "执行人221"
          }],
        }, {
          "taskType": 0,
          "taskName": "并行任务222",
          "subTasks": null,
          "state": 20,
          "assignees": [{
            "nickname": "执行人222"
          }],
        }],
      },
      {
        "taskType": 0,
        "taskName": "并行任务23",
        "subTasks": null,
        "state": 10,
        "assignees": [{
          "nickname": "执行人23"
        }],
      }
    ],
  }, {
    "taskType": 0,
    "subTasks": null,
    "state": 30,
    "taskName": "串行任务13",
    "assignees": [{
      "username": "123456",
      "nickname": "执行人13"
    }],
  }],
}