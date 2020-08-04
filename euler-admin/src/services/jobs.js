import axios from 'axios'
import qs from 'qs'

class JobService {
  listJobs = params => {
    return axios.get('/jobs', {
      params: {
        page: 0,
        size: 10,
        'sort-by': 'CREATION_DATE',
        'sort-direction': 'ASC',
        ...params,
      },
    })
  }
}

export default JobService
