import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import {
  Button, message, Popconfirm, Row, Space, Switch, Typography,
} from 'antd'
import {
  ExperimentTwoTone, EyeInvisibleOutlined, EyeOutlined, FundTwoTone,
} from '@ant-design/icons'

import Unit from 'components/molecules/Unit/Unit'
import UnitMinified from 'components/molecules/UnitMinified/UnitMinified'
import UnitStore from 'domain/unit/unit.store'
import DestroyService from 'domain/unit/destroy.service'
import ReproductionService from 'domain/unit/reproduction.service'
import GenerationService from 'domain/unit/generation.service'
import { getRandomPopulationName } from 'common/helpers'

const { Text, Title } = Typography

// (!) TODO: то ли шансы родить выше, чем умереть, то ли неправильно считается шанс выжить при росте популяции
// Да, действительно с ростом популяции роста смертности не происходит
// (!!) TODO: В общем, докрутить так, чтобы при меньшем количестве шансов было больше, а при большем наоборот — меньше
// (!!) TODO: адаптировать под мобилку

// TODO: понять почему иногда счетчики не перерисовываются
// TODO: добавить автосмену поколений с простой регулировкой скорости
// TODO: перевернуть отображение старыми юнитами вниз?
// TODO: (!) история родительских генов и мутации при приближении
// TODO: добавить возможность экспорта истории и дерева
// TODO: добавить возможность влияния на шансы (уровень мутантности, питание, конкуренты, среда,...)

const Evolution = () => {
  const [currentGeneration, setCurrentGeneration] = useState(1)
  const [hoveredUnitId, setHoveredUnitId] = useState(null)
  const [hoveredUnitParentsIds, setHoveredUnitParentsIds] = useState(null)
  const [isMinifiedMode, setMinifiedMode] = useState(false)
  const [populationName, setPopulationName] = useState(getRandomPopulationName())
  const [lastDestroyedCount, setLastDestroyedCount] = useState(null)
  const [lastBornCount, setLastBornCount] = useState(null)

  const aliveUnits = UnitStore.units.filter(({ isDead }) => !isDead)

  const isNoAliveUnits = aliveUnits.length < 1

  useEffect(() => {
    GenerationService.createFirstGeneration()
  }, [])

  useEffect(() => {
    if (currentGeneration > 1) {
      DestroyService.destroySomeUnits()
        .then(count => setLastDestroyedCount(count))
      setLastBornCount(ReproductionService.getNewbornUnits())
      GenerationService.increaseGenerationForAliveUnits()
    }
  }, [currentGeneration])

  useEffect(() => {
    if (currentGeneration > 1 && UnitStore.units.filter(({ isDead }) => !isDead) < 1) {
      message.warn('Популяция всё, попробуйте создать новую')
    }
  }, [currentGeneration, isNoAliveUnits])

  // useEffect(() => {
  //   if (aliveUnits.length > 100) {
  //     setMinifiedMode(true) // TODO: Почему не перерисовывается Switch? O_o
  //   }
  // }, [aliveUnits.length])

  // TODO: проработать механику эпидемии
  // useEffect(() => {
  //   if (aliveUnits.length > 100 && Math.random() < 0.5) {
  //     message.error('Эпидемия!')

  //     DestroyService.epidemicDestroy()
  //   }
  // }, [aliveUnits])

  const onUnitHover = (unit) => {
    setHoveredUnitId(unit.id)
    setHoveredUnitParentsIds(unit.parentsIds)
  }

  const cleanHovered = () => {
    setHoveredUnitId(null)
    setHoveredUnitParentsIds(null)
  }

  const handleResetClick = () => {
    setCurrentGeneration(1)
    setPopulationName(getRandomPopulationName())
    setLastDestroyedCount(null)
    setLastBornCount(null)
    GenerationService.createFirstGeneration()
    // TODO: (!) сбрасывать и другие счетчики
  }

  return (
    <Row align="center">
      <Space direction="vertical" size={40} style={{ padding: 50, margin: '0 auto' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Row align="middle" justify="space-between">
            <Space size={15}>
              <Title level={4} style={{ marginBottom: 3 }}>{populationName}</Title>
              <Text>
                {`${currentGeneration} поколение`}
              </Text>
            </Space>
            <Space>
              <Switch
                checked={!isMinifiedMode}
                checkedChildren={<EyeOutlined />}
                style={{ marginBottom: 3 }}
                unCheckedChildren={<EyeInvisibleOutlined />}
                onClick={() => setMinifiedMode(!isMinifiedMode)}
              />
            </Space>
          </Row>
          <Row align="start">
            <Space size={25}>
              <Space size={5}>
                <ExperimentTwoTone
                  twoToneColor="#af50f2"
                />
                <Text>
                  {`Популяция: ${aliveUnits.length}`}
                </Text>
              </Space>
              {lastBornCount !== null
                && (
                  <Space size={5}>
                    <FundTwoTone
                      twoToneColor="#af50f2"
                    />
                    <Text>
                      {`Прирост: ${lastBornCount}`}
                    </Text>
                  </Space>
                )}
              {lastDestroyedCount !== null
                && (
                  <Space size={5}>
                    <FundTwoTone
                      style={{ transform: 'scaleY(-1)' }}
                      twoToneColor="#af50f2"
                    />
                    <Text>
                      {`Потери: ${lastDestroyedCount}`}
                    </Text>
                  </Space>
                )}
              {/* Вынести в шапку и сделать процент прироста */}
            </Space>
          </Row>
        </Space>
        <div style={{
          width: 'calc(100vw - 30px)',
          maxWidth: 800,
          height: 300,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, 68px)',
          gap: 10,
          gridAutoRows: 25,
        }}
        >
          {/* TODO: Понять почему тут приходится фильтровать вместо простого вызова .aliveUnits */}
          {UnitStore.units
            .map((unit) => (!isMinifiedMode ? (
              <Unit
                key={unit.id}
                isAnythingHovered={hoveredUnitParentsIds?.length}
                isHovered={hoveredUnitId === unit.id}
                isParentForHoveredUnit={hoveredUnitParentsIds?.includes(unit.id)}
                unit={unit}
                onMouseEnter={() => onUnitHover(unit)}
                onMouseLeave={cleanHovered}
              />
            ) : (
              <UnitMinified key={unit.id} unit={unit} />
            )))}
        </div>
        <Space direction="vertical" size={25} style={{ width: '100%' }}>
          <Row align="center">
            <Button
              disabled={isNoAliveUnits}
              type="primary"
              onClick={() => setCurrentGeneration(currentGeneration + 1)}
            >
              Следующее поколение
            </Button>
          </Row>
          <Row align="center">
            <Popconfirm
              cancelButtonProps={{ size: 'large' }}
              cancelText="Нет"
              okButtonProps={{ size: 'large' }}
              okText="Да"
              placement="bottom"
              title="Начать сначала?"
              onConfirm={handleResetClick}
            >
              <Button>
                Начать сначала
              </Button>
            </Popconfirm>
          </Row>
        </Space>
      </Space>
    </Row>
  )
}

export default observer(Evolution)
