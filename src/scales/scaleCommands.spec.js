import * as sm from './scaleMessages'
import * as sc from './scaleCodes'
import * as cmds from './scaleCommands'

describe('scaleCommands module', () => {
  const address = '02BFF366'

  describe('getWeight()', ()=>{
    it('returns valid getWeight command', () => {
      expect(cmds.getWeight(address))
      .toEqual({})
    }) 
  })
})
