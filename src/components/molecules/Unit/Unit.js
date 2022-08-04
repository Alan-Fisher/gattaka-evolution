import React from 'react'
import {
  Badge, Popover, Space, Tag,
} from 'antd'
import _ from 'lodash'

import { getRGBfromHex, isBackgroundTooLight } from 'common/helpers'
import UnitStore from 'domain/unit/unit.store'

const GENERATION_COUNT_COLORS = {
  1: '#40a9ff',
  2: '#fadb14',
  3: '#fa541c',
}

const Unit = ({
  unit, isParentForHoveredUnit, onMouseEnter, onMouseLeave, isAnythingHovered, isHovered,
  // TODO: переделать isAnythingHovered и isHovered в showShadow и lowOpacity и считать снаружи
}) => {
  const {
    generation, genes, isDead,
  } = unit

  const SHADOW_COLOR = Object.values(getRGBfromHex(genes))
    .join(', ')
  const UNIT_SHADOW = `
    rgba(${SHADOW_COLOR}, 0.4) -5px 5px, 
    rgba(${SHADOW_COLOR}, 0.3) -10px 10px, 
    rgba(${SHADOW_COLOR}, 0.2) -15px 15px, 
    rgba(${SHADOW_COLOR}, 0.1) -20px 20px, 
    rgba(${SHADOW_COLOR}, 0.05) -25px 25px
  `
  const shouldLowerOpacity = isDead || (!isHovered && !isParentForHoveredUnit && isAnythingHovered)

  return (
    // <Tooltip title={`ID: ${id} | Parents: ${parentsIds?.join(' & ')}`} trigger="click">
    <Popover content={<GenesHistory unit={unit} />} placement="bottom">
      <Badge
        color={GENERATION_COUNT_COLORS[generation] || GENERATION_COUNT_COLORS[3]}
        count={generation}
        offset={[-8, 3]} // TODO: отображать римскими?
        size="small"
        style={{ fontSize: '10px', display: shouldLowerOpacity && 'none' }}
      >
        <Tag
          color={`#${genes}`}
          style={{
            fontFamily: 'monospace',
            opacity: shouldLowerOpacity && 0.1,
            color: isBackgroundTooLight(genes) ? '#000' : '#fff',
            transform: isParentForHoveredUnit ? 'scale(1.1)' : undefined,
            boxShadow: isParentForHoveredUnit ? UNIT_SHADOW : undefined,
            width: 60,
          }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {genes}
        </Tag>
      </Badge>
    </Popover>
  )
}

// TODO: вынести!
const GenesHistory = ({ unit }) => {
  const { mutationHistory, parentsIds, genes } = unit
  // TODO: !! переместить работу с UnitStore в сторону
  // TODO: оптмизировать!
  if (parentsIds?.length) {
    const unitGenesArray = genes.split('')
    const firstParentGenesArray = UnitStore.byId.get(parentsIds[0]).genes.split('')
    const secondParentGenesArray = UnitStore.byId.get(parentsIds[1]).genes.split('')

    return (
      <div style={{
        display: 'grid',
        height: '200px',
        gap: 5,
      }}
      >
        {/* TODO: прихорошить */}
        {/* TODO: проверить, чет часто мутации совпадают с родительскими генами */}

        <Space style={{ fontFamily: 'monospace' }}>
          <Space direction="vertical">
            {firstParentGenesArray.map((gene, i) => (
              <Tag
                color={unitGenesArray[i] === gene ? 'green' : 'white'}
                style={{ color: 'black' }}
              >
                {gene}
              </Tag>
            ))}
          </Space>
          <Space direction="vertical">
            {secondParentGenesArray.map((gene, i) => (
              <Tag
                color={unitGenesArray[i] === gene ? 'green' : 'white'}
                style={{ color: 'black' }}
              >
                {gene}
              </Tag>
            ))}
          </Space>
          <Space direction="vertical">
            {/* {console.log(_.range(0, 5).map(emptyIdx => mutationHistory
              .find(({ idx }) => idx === emptyIdx)))} */}
            {_.range(0, 6)
              .map(emptyIdx => mutationHistory
                .find(({ idx }) => idx === emptyIdx))
              .map((mutation) => (mutation?.hex
                ? <Tag color="red">{mutation?.hex}</Tag>
                : <Tag style={{ opacity: 0 }}>0</Tag>))}
          </Space>
        </Space>
      </div>
    )
  }

  return null
}

export default Unit
