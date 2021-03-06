import axios from 'axios'
import qs from 'qs'

class TemplateService {
  listTemplates = params => {
    return axios.get('/templates', {
      params: {
        page: 0,
        size: 10,
        name: null,
        ...params,
      },
    })
  }
  createTemplate = (name, config) => {
    return axios.put('/template', { name, config })
  }
  getTemplateDetails = templateName => {
    return axios.get(`/template/${templateName}`)
  }
  enqueueTemplateAsJob = (templateName, params) => {
    return axios.post(`/template/${templateName}`, params)
  }
  deleteTemplate = templateName => {
    return axios.delete(`/template/${templateName}`)
  }
}

export default TemplateService
