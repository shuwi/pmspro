<template id="workkind-page">
  <div style="width:100vw;">
    <div style="margin:90px auto 20px auto;width:95%;">
      <Button shape="circle" icon="md-add" class="btn" type="primary" @click="showWorkKindModal">添加工种</Button>
    </div>
    <div style="margin:0 auto 20px auto;width:95%;">
      <Table border :columns="workkindColumns" :data="workkindArr" ref="selectedWorkkinds" width="100%" size="small"></Table>
    </div>
    <div style="margin:0 auto 120px auto;width:95%;">
      <Page :current="current" :total="total" show-total style="float:right;" @on-change="workKindGet" :page-size="pagesize" />
    </div>
    <work-kind-modal @workKindGet="workKindGet"></work-kind-modal>
  </div>
</template>
<script>
  import WorkKindModal from '../modals/workkind/WorkkindModal.vue'
  import {
    mapActions
  } from 'vuex'
  export default {
    name: 'workkind-page',
    components: {
      WorkKindModal
    },
    data() {
      return {
        current: 1,
        total: 0,
        pagesize: 10,
        workkindlist: [],
        workkindArr: [],
        workkindColumns: [{
            type: 'index',
            width: 60,
            align: 'center',
            title: '序号'
          },
          {
            title: '名称',
            key: 'name'
          },
          {
            title: '工种类别',
            key: 'workKindTypeName'
          }
          /* , {
                      title: '操作',
                      key: 'action',
                      align: 'center',
                      className: 'address-table-info-column',
                      render: (h, params) => {
                        if (this.$store.state.modals.login.mode !== '0') {
                          return h('div', [
                            h('Button', {
                              props: {
                                type: 'primary',
                                size: 'small',
                                shape: 'circle',
                                icon: 'ios-pricetag-outline'
                              },
                              style: {
                                marginLeft: '0px',
                                width: '80px'
                              },
                              on: {
                                click: () => {
                                  this.editWorkKind(params.row)
                                }
                              }
                            }, '修改'),
                            h('Button', {
                              props: {
                                type: 'error',
                                size: 'small',
                                shape: 'circle',
                                icon: 'md-trash'
                              },
                              style: {
                                marginLeft: '10px',
                                width: '80px'
                              },
                              on: {
                                click: () => {
                                  this.delWorkKind(params.row)
                                }
                              }
                            }, '删除')
                          ])
                        }
                      }
                    } */
        ]
      }
    },
    created() {
      this.workKindGet(1)
    },
    methods: {
      ...mapActions([
        'showWorkKindModal',
        'hideWorkKindModal'
      ]),
      workKindGet(pagenum) {
        var that = this
        that.$workkindRepo.createTable().then(() => that.$workkindRepo.getWorkkinds(pagenum, that.pagesize)).then((mlist) => {
          that.$workkindRepo.getworkkindsCount().then((res) => {
            if (res.results[0].num > 0) {
              that.total = res.results[0].num
              that.workkindArr = mlist.results
            }
          }).catch((err) => {
            console.log('createTable machine Error: ', err)
          })

        }).catch((err) => {
          console.log('createTable machine Error: ', err)
        })
      },
      editWorkKind(item) {
        this.showWorkKindModal(item)
      },
      workkindsel(sel) {
        this.workkindlist = sel
      },
      delWorkKind(v) {
        this.$Modal.confirm({
          title: '确认',
          content: `<p>确认删除工种${v.name}？</p>`,
          onOk: () => {
            var that = this
            var postdata = {
              workId: v.id,
              name: v.name,
              delFlag: -1
            }
            var dd = []
            dd.push(postdata)
            that.$Spin.show()
            that.$http({
                baseURL: that.$store.state.modals.settings.baseURL,
                url: '/addClientWorkKind.whtml',
                method: 'post',
                data: {
                  clientWorkkind: JSON.stringify(dd)
                },
                headers: {
                  'Content-Type': 'application/json',
                  'token': that.$store.state.modals.login.token
                }
              })
              .then(function (data) {
                console.log('远程添加', data)
                if (data.data.code === 1) {
                  that.$Notice.success({
                    title: '提醒',
                    desc: '远程操作成功'
                  })
                  var dellist = []
                  dellist.push(v.id)
                  that.$workkindRepo.delete(dellist).then(() => {
                    that.$Notice.success({
                      title: '提醒',
                      desc: '删除成功'
                    })
                  }).catch((err) => {
                    that.$Notice.error({
                      title: '提醒',
                      desc: '删除失败'
                    })
                    console.log('删除失败: ', err)
                  }).finally(() => {
                    that.$Spin.hide()
                    that.workKindGet()
                  })
                } else {
                  that.$Notice.error({
                    title: '提醒',
                    desc: data.data.msg
                  })
                }
              })
              .catch(function (error) {
                that.$Notice.error({
                  title: '提醒',
                  desc: '远程删除异常！'
                })
                console.log(error)
              })
              .finally(() => {
                that.$Spin.hide()
                that.workKindGet()
              })

          }
        })
      }
    }
  }

</script>
