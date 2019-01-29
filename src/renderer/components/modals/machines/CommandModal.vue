<template>
  <Modal id="command-modal" v-model="isVisible" @on-visible-change="visibleChange" :mask-closable="false" :footer-hide="true"
    width="1000" :closable="true">
    <p slot="header">
      <Icon type="logo-buffer" />
      <span style="font-weight:normal;">历史命令查询</span>
    </p>
    <div>
      <p style="margin:0 auto 20px auto;width:95%;">
        <Input placeholder="请输入关键字查询" style="width:300px;margin:0 10px 0 0;" clearable v-model="keyword" />
        <Button shape="circle" icon="md-search" class="btn" @click="refreshList(1)">查询</Button>
      </p>
      <p style="margin:0 auto 20px auto;width:95%;">
        <Table border :columns="columns" :data="arr" ref="selectedWorkers" width="100%" size="small" @on-row-click="rowClick"></Table>
      </p>
      <p style="margin:0 auto 20px auto;width:95%;text-align:right;">
        <Page :current="current" :total="total" show-total @on-change="refreshList" :page-size="pagesize" />
      </p>
    </div>
  </Modal>
</template>
<script>
  export default {
    name: 'command-modal',
    props: ['machinesellist'],
    computed: {
      isVisible: {
        get() {
          return this.$store.state.modals.commandModal.isVisible
        },
        set(value) {

        }
      }
    },
    data() {
      return {
        keyword: '',
        current: 1,
        total: 0,
        pagesize: 10,
        arr: [],
        columns: [{
            type: 'index',
            width: 60,
            align: 'center',
            title: '序号'
          },
          {
            title: '设备名称',
            key: 'machinesn'
          },
          {
            title: '设备序列号',
            key: 'machinesn'
          },
          {
            title: '下发时间',
            key: 'createdate'
          },
          {
            title: '执行时间',
            key: 'executedate'
          },
          {
            title: '命令类型',
            key: 'commandtype'
          },
          {
            title: '执行结果',
            key: 'resulttype',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  props: {

                  }
                }),
                this.resultType(params.row.resulttype)
              ])
            }
          },
          {
            title: '命令下发人',
            width: 90,
            key: 'commandfrom'
          },
          {
            title: '附加信息',
            key: 'commandext'
          }
        ]
      }
    },
    mounted() {
      this.refreshList(1)
    },
    methods: {
      refreshList(number) {
        var that = this
        if (typeof that.$store.state.modals.login.projectId
          .id === 'undefined')
          return
        if (typeof that.machinesellist[0] === 'undefined')
          return
        var str = {
          projectid: that.$store.state.modals.login.projectId.id,
          machinesn: typeof that.machinesellist[0].sn === 'undefined' ? '' : that.machinesellist[0].sn,
          keyword: that.keyword,
          pagenum: number,
          pagesize: that.pagesize
        }
        that.$commandRepo.getCommands(str).then((res) => {
          that.arr = res.results
        }).then(() => {
          that.$commandRepo.getCommandsCount(str).then((data) => {
            console.log('getCommandsCount = ', data)
            that.total = data.results[0].num
          }).catch((err) => {
            console.log('getCommandsCount Error: ', err)
          })
        }).catch((err) => {
          console.log('getCommands Error: ', err)
        })
      },
      visibleChange(isVisible) {
        if (!isVisible) {
          this.closeModal()
        } else {
          this.refreshList(1)
        }
      },
      closeModal() {
        this.current = 1
        this.$store.dispatch('hideCommandModal')
      },
      rowClick(row, index) {
        console.log('row = ', row)
        console.log('index = ', index)
      },
      resultType(type) {
        var res = '未执行'
        switch (type) {
          case 1:
            res = '执行成功'
            break
          case 2:
            res = '执行失败'
            break
        }
        return res
      }
    }
  }

</script>
